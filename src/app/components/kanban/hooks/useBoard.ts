import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BoardData, JobCard } from '../../../services/types/frontendtypes/frontend';
import { StorageService } from '../services/StorageService';
import { INITIAL_DATA } from '../services/initialData';
import { isAuthenticated, getCurrentBoard } from '../../../services/api/auth';
import {
  useBoardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  useMoveCardMutation,
  boardKeys,
} from './useBoardQueries';

/**
 * 生成 UUID（用于离线模式下创建卡片）
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/** 认证状态变化事件 */
const AUTH_CHANGE_EVENT = 'auth-change';

/** 触发认证状态变化事件 */
export function notifyAuthChange(isLoggedIn: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { isLoggedIn } }));
  }
}

export const useBoard = () => {
  const queryClient = useQueryClient();
  const currentBoard = getCurrentBoard();

  // ========== 数据模式状态 ==========
  // mode 控制当前使用的数据源：'online' 使用后端数据，'offline' 使用本地数据
  // 初始值固定为 'offline' 以避免 SSR hydration mismatch
  // 实际模式将在 useEffect 中根据认证状态确定
  const [mode, setMode] = useState<'online' | 'offline'>('offline');

  // 在客户端挂载后，根据实际认证状态设置初始模式
  useEffect(() => {
    const initialMode = isAuthenticated() ? 'online' : 'offline';
    setMode(initialMode);
  }, []);

  // ========== 离线模式状态 ==========
  const [offlineBoard, setOfflineBoard] = useState<BoardData>(() => ({ ...INITIAL_DATA }));
  const [isOfflineLoading, setIsOfflineLoading] = useState(false);

  // 仅在客户端挂载后从 localStorage 加载
  useEffect(() => {
    queueMicrotask(() => {
      const localData = StorageService.loadBoard();
      setOfflineBoard(localData);
    });
  }, []);

  // ========== 在线模式状态（React Query）==========
  const {
    data: onlineBoard,
    isLoading: isOnlineLoading,
    error: onlineError,
  } = useBoardQuery(currentBoard?.boardId);

  // ========== 在线模式 Mutations ==========
  const createCardMutation = useCreateCardMutation();
  const updateCardMutation = useUpdateCardMutation();
  const deleteCardMutation = useDeleteCardMutation();
  const moveCardMutation = useMoveCardMutation();

  // ========== 监听认证状态变化，切换数据模式 ==========
  useEffect(() => {
    const handleAuthChange = (event: CustomEvent<{ isLoggedIn: boolean }>) => {
      const newMode = event.detail.isLoggedIn ? 'online' : 'offline';
      setMode(newMode);

      if (event.detail.isLoggedIn) {
        // 登录：使看板查询失效，触发 React Query 重新获取数据
        queryClient.invalidateQueries({ queryKey: boardKeys.all });
      } else {
        // 登出：清除 React Query 缓存中的看板数据，避免显示旧数据
        queryClient.removeQueries({ queryKey: boardKeys.all });
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    };
  }, [queryClient]);

  // ========== 根据 mode 选择数据源 ==========
  const board = mode === 'online' && onlineBoard ? onlineBoard : offlineBoard;
  const isLoading = mode === 'online' ? isOnlineLoading : isOfflineLoading;
  const error = mode === 'online' ? onlineError?.message || null : null;

  // ========== 离线模式操作 ==========

  // 离线添加卡片
  const addOfflineJob = useCallback((
    title: string,
    company: string,
    columnId: string,
    options?: Partial<JobCard>
  ): BoardData => {
    const now = new Date();
    const newCard: JobCard = {
      id: generateUUID(),
      boardId: offlineBoard.board.id,
      jobTitle: title,
      companyName: company,
      statusId: columnId,
      createdAt: now,
      updatedAt: now,
      ...options,
    };
    const newBoard = {
      ...offlineBoard,
      cards: [...offlineBoard.cards, newCard],
    };
    setOfflineBoard(newBoard);
    StorageService.saveBoard(newBoard);
    return newBoard;
  }, [offlineBoard]);

  // 离线移动卡片
  const moveOfflineCard = useCallback((cardId: string, targetColId: string): BoardData => {
    const newBoard = {
      ...offlineBoard,
      cards: offlineBoard.cards.map(card =>
        card.id === cardId ? { ...card, statusId: targetColId, updatedAt: new Date() } : card
      ),
    };
    setOfflineBoard(newBoard);
    StorageService.saveBoard(newBoard);
    return newBoard;
  }, [offlineBoard]);

  // 离线更新卡片
  const updateOfflineCard = useCallback((
    cardId: string,
    updates: Partial<JobCard>
  ): BoardData => {
    const newBoard = {
      ...offlineBoard,
      cards: offlineBoard.cards.map(card =>
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
      ),
    };
    setOfflineBoard(newBoard);
    StorageService.saveBoard(newBoard);
    return newBoard;
  }, [offlineBoard]);

  // 离线删除卡片
  const deleteOfflineCard = useCallback((cardId: string): BoardData => {
    const newBoard = {
      ...offlineBoard,
      cards: offlineBoard.cards.filter(card => card.id !== cardId),
    };
    setOfflineBoard(newBoard);
    StorageService.saveBoard(newBoard);
    return newBoard;
  }, [offlineBoard]);

  // ========== 统一操作接口 ==========

  // 添加卡片
  const handleAddJob = async (
    title: string,
    company: string,
    columnId: string,
    options?: Partial<JobCard>
  ) => {
    if (mode === 'online') {
      // 在线模式：使用 React Query Mutation
      await createCardMutation.mutateAsync({
        board,
        title,
        company,
        columnId,
        options,
      });
    } else {
      // 离线模式：直接操作本地状态
      setIsOfflineLoading(true);
      try {
        addOfflineJob(title, company, columnId, options);
      } finally {
        setIsOfflineLoading(false);
      }
    }
  };

  // 移动卡片
  const handleMoveCard = async (cardId: string, targetColId: string) => {
    if (mode === 'online') {
      await moveCardMutation.mutateAsync({
        board,
        cardId,
        targetColumnId: targetColId,
      });
    } else {
      setIsOfflineLoading(true);
      try {
        moveOfflineCard(cardId, targetColId);
      } finally {
        setIsOfflineLoading(false);
      }
    }
  };

  // 更新卡片
  const handleUpdateCard = async (cardId: string, updates: Partial<JobCard>) => {
    if (mode === 'online') {
      await updateCardMutation.mutateAsync({
        board,
        cardId,
        updates,
      });
    } else {
      setIsOfflineLoading(true);
      try {
        updateOfflineCard(cardId, updates);
      } finally {
        setIsOfflineLoading(false);
      }
    }
  };

  // 删除卡片
  const handleDeleteCard = async (cardId: string) => {
    if (mode === 'online') {
      await deleteCardMutation.mutateAsync({
        board,
        cardId,
      });
    } else {
      setIsOfflineLoading(true);
      try {
        deleteOfflineCard(cardId);
      } finally {
        setIsOfflineLoading(false);
      }
    }
  };

  // 强制重新加载看板数据（在线模式）
  const loadBoard = useCallback(async (boardId?: string) => {
    // 在 React Query 中，refetch 会自动处理
    // 这个方法保留用于兼容性
    console.log('loadBoard called, boardId:', boardId);
  }, []);

  return {
    board,
    isLoading,
    error,
    loadBoard,
    handleAddJob,
    handleMoveCard,
    handleUpdateCard,
    handleDeleteCard,
    // 额外暴露当前模式信息，用于 UI 显示
    isAuthenticated: mode === 'online',
    mode,
  };
};
