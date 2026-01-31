'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useBoard } from '../hooks/useBoard';
import type {
  BoardData,
  JobCard,
} from '../../../services/types/frontendtypes/frontend';

// ============ 1. 类型定义 ============
// Context 暴露给消费者的完整接口
export interface BoardContextValue {
  // 看板数据
    board: BoardData;

  // 卡片操作
  handleAddJob: (
    title: string,
    company: string,
    columnId: string,
    options?: Partial<JobCard>
  ) => void;
  handleUpdateCard: (cardId: string, updates: Partial<JobCard>) => void;
  handleDeleteCard: (cardId: string) => void;
  handleMoveCard: (cardId: string, targetColId: string) => void;
  
  // 弹窗状态
  isCardOpen: boolean;
  selectedCard: JobCard | null;
  /** 每次 openCard 时递增，用作 FormEditWindow 的 key 以强制重新挂载 */
  formInstanceId: number;
  isPreviewOpen: boolean;
  previewCard: JobCard | null;

  // 弹窗操作
  /** 传入 cardId 打开编辑弹窗（null 表示新建卡片） */
  openCard: (cardId: string | null) => void;
  closeCard: () => void;
  /** 传入 cardId 打开只读预览弹窗 */
  openPreview: (cardId: string) => void;
  closePreview: () => void;
  // 表单提交 （内部会调用update/add + closeCard）
  handleSave: (data: Partial<JobCard>) => void;
  handleDelete: (id: string) => void;
}

// ============ 2. 创建 Context ============
// 默认 null，用于在 Provider 外使用时抛出明确错误
export const BoardContext = createContext<BoardContextValue | null>(null);

// ============ 3. Provider 组件 ============
export function BoardProvider({ children }: { children: React.ReactNode }) {
  const {
    board,
    handleAddJob,
    handleUpdateCard,
    handleDeleteCard,
    handleMoveCard,
  } = useBoard();

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<JobCard | null>(null);
  const [formInstanceId, setFormInstanceId] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCard, setPreviewCard] = useState<JobCard | null>(null);

  // openCard：每次打开都递增 formInstanceId，确保 FormEditWindow 重新挂载
  // 使用 cardId 从最新的 board.cards 中查找卡片，避免使用可能过时的引用
  const openCard = useCallback((cardId: string | null) => {
    const card = cardId ? board.cards.find((c) => c.id === cardId) : null;
    setSelectedCard(card ?? null);
    setIsCardOpen(true);
    setFormInstanceId((id) => id + 1);
  }, [board.cards]);

  const closeCard = useCallback(() => {
    setIsCardOpen(false);
    setSelectedCard(null);
  }, []);

  const openPreview = useCallback(
    (cardId: string) => {
      const card = board.cards.find((c) => c.id === cardId) ?? null;
      setPreviewCard(card);
      setIsPreviewOpen(true);
    },
    [board.cards]
  );

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewCard(null);
  }, []);

  // handleSave 依赖 selectedCard、board.columns 等，必须正确声明 deps
  const handleSave = useCallback(
    (data: Partial<JobCard>) => {
      if (selectedCard) {
        handleUpdateCard(selectedCard.id, data);
      } else {
        handleAddJob(
          data.jobTitle ?? '',
          data.companyName ?? '',
          data.statusId ?? board.columns[0]?.id ?? '',
          data
        );
      }
      closeCard();
    },
    [
      selectedCard,
      handleUpdateCard,
      handleAddJob,
      board.columns,
      closeCard,
    ]
  );

  const handleDelete = useCallback(
    (id: string) => {
      handleDeleteCard(id);
      closeCard();
    },
    [handleDeleteCard, closeCard]
  );

  // 将所有值打包成 value，useMemo 依赖须包含 value 中用到的所有引用
  const value = useMemo<BoardContextValue>(
    () => ({
      board,
      handleAddJob,
      handleUpdateCard,
      handleDeleteCard,
      handleMoveCard,
      isCardOpen,
      selectedCard,
      formInstanceId,
      isPreviewOpen,
      previewCard,
      openCard,
      closeCard,
      openPreview,
      closePreview,
      handleSave,
      handleDelete,
    }),
    [
      board,
      handleAddJob,
      handleUpdateCard,
      handleDeleteCard,
      handleMoveCard,
      isCardOpen,
      selectedCard,
      formInstanceId,
      isPreviewOpen,
      previewCard,
      openCard,
      closeCard,
      openPreview,
      closePreview,
      handleSave,
      handleDelete,
    ]
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

// ============ 4. 消费 Hook ============
export function useBoardContext(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error('useBoardContext must be used within BoardProvider');
  }
  return ctx;
}
