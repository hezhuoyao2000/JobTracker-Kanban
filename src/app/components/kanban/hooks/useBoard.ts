import { useState, useEffect, useCallback } from 'react';
import { BoardData, JobCard } from '../../../services/types/frontendtypes/frontend';
import { BoardService } from '../services/BoardService';
import { StorageService } from '../services/StorageService';
import { INITIAL_DATA } from '../services/initialData';

export const useBoard = () => {
  // 1. 初始化：使用常量确保 SSR 与客户端首次渲染一致，避免 hydration mismatch
  const [board, setBoard] = useState<BoardData>(() => ({ ...INITIAL_DATA }));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. 仅在客户端挂载后从 localStorage 加载（localStorage 仅存在于浏览器）
  // 使用 queueMicrotask 延迟 setState，避免在 effect 内同步触发导致 cascading renders
  useEffect(() => {
    queueMicrotask(() => setBoard(StorageService.loadBoard()));
  }, []);

  // 3. 封装 Service 动作（现在都是异步的）

  // 从后端加载看板数据
  const loadBoard = useCallback(async (boardId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBoard = await BoardService.loadBoard(boardId);
      setBoard(newBoard);
      StorageService.saveBoard(newBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载看板失败');
      console.error('加载看板失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 添加一张卡片
  const handleAddJob = async (
    title: string,
    company: string,
    columnId: string,
    options?: Partial<Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'jobTitle' | 'companyName' | 'statusId'>>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBoard = await BoardService.addJob(board, title, company, columnId, options);
      setBoard(newBoard);
      StorageService.saveBoard(newBoard); // 同步到本地
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加卡片失败');
      console.error('添加卡片失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 移动卡片
  const handleMoveCard = async (cardId: string, targetColId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBoard = await BoardService.moveCard(board, cardId, targetColId);
      setBoard(newBoard);
      StorageService.saveBoard(newBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : '移动卡片失败');
      console.error('移动卡片失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新卡片
  const handleUpdateCard = async (
    cardId: string,
    updates: Partial<Omit<JobCard, 'id' | 'boardId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBoard = await BoardService.updateCard(board, cardId, updates);
      setBoard(newBoard);
      StorageService.saveBoard(newBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新卡片失败');
      console.error('更新卡片失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除卡片
  const handleDeleteCard = async (cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newBoard = await BoardService.deleteCard(board, cardId);
      setBoard(newBoard);
      StorageService.saveBoard(newBoard);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除卡片失败');
      console.error('删除卡片失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    board,
    isLoading,
    error,
    loadBoard,
    handleAddJob,
    handleMoveCard,
    handleUpdateCard,
    handleDeleteCard,
  };
};
