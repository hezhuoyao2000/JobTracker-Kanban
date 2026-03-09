/**
 * React Query hooks for board data
 * 用于在线模式下的数据获取和变更
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BoardService } from '../services/BoardService';
import type { BoardData, JobCard } from '../../../services/types/frontendtypes/frontend';

// Query keys
export const boardKeys = {
  all: ['board'] as const,
  detail: (id: string) => [...boardKeys.all, id] as const,
};

/**
 * 获取看板数据
 */
export function useBoardQuery(boardId?: string) {
  return useQuery({
    queryKey: boardKeys.detail(boardId || 'default'),
    queryFn: () => BoardService.loadBoard(boardId),
    enabled: !!boardId, // 只有提供了 boardId 才执行查询
  });
}

/**
 * 创建卡片
 */
export function useCreateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      board,
      title,
      company,
      columnId,
      options,
    }: {
      board: BoardData;
      title: string;
      company: string;
      columnId: string;
      options?: Partial<JobCard>;
    }) => {
      return BoardService.addJob(board, title, company, columnId, options);
    },
    onSuccess: (newBoard, variables) => {
      // 更新缓存
      queryClient.setQueryData(
        boardKeys.detail(variables.board.board.id),
        newBoard
      );
    },
  });
}

/**
 * 更新卡片
 */
export function useUpdateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      board,
      cardId,
      updates,
    }: {
      board: BoardData;
      cardId: string;
      updates: Partial<JobCard>;
    }) => {
      return BoardService.updateCard(board, cardId, updates);
    },
    onSuccess: (newBoard, variables) => {
      queryClient.setQueryData(
        boardKeys.detail(variables.board.board.id),
        newBoard
      );
    },
  });
}

/**
 * 删除卡片
 */
export function useDeleteCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      board,
      cardId,
    }: {
      board: BoardData;
      cardId: string;
    }) => {
      return BoardService.deleteCard(board, cardId);
    },
    onSuccess: (newBoard, variables) => {
      queryClient.setQueryData(
        boardKeys.detail(variables.board.board.id),
        newBoard
      );
    },
  });
}

/**
 * 移动卡片
 */
export function useMoveCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      board,
      cardId,
      targetColumnId,
    }: {
      board: BoardData;
      cardId: string;
      targetColumnId: string;
    }) => {
      return BoardService.moveCard(board, cardId, targetColumnId);
    },
    onSuccess: (newBoard, variables) => {
      queryClient.setQueryData(
        boardKeys.detail(variables.board.board.id),
        newBoard
      );
    },
  });
}
