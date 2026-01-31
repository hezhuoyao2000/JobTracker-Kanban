'use client';

import { useState, useCallback } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { JobCard } from '../../../services/types/frontendtypes/frontend';

export interface UseDragAndDropOptions {
  /** 所有卡片数据，用于查找当前拖拽的卡片 */
  cards: JobCard[];
  /** 移动卡片的回调 */
  onMoveCard: (cardId: string, targetColumnId: string) => void;
}

export interface UseDragAndDropReturn {
  /** 传感器配置，传给 DndContext */
  sensors: ReturnType<typeof useSensors>;
  /** 拖拽开始处理器 */
  handleDragStart: (event: DragStartEvent) => void;
  /** 拖拽结束处理器 */
  handleDragEnd: (event: DragEndEvent) => void;
  /** 当前正在拖拽的卡片（用于 DragOverlay） */
  activeCard: JobCard | null;
}

/**
 * 封装看板拖拽逻辑的 Hook
 * 
 * 功能：
 * - 配置拖拽传感器（PointerSensor，移动 8px 后触发，避免误触）
 * - 管理拖拽状态（正在拖拽的卡片）
 * - 处理拖拽结束事件（调用 onMoveCard）
 * 
 * 使用示例：
 * ```tsx
 * const { sensors, handleDragStart, handleDragEnd, activeCard } = useDragAndDrop({
 *   cards: board.cards,
 *   onMoveCard: handleMoveCard,
 * });
 * 
 * <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
 *   ...
 *   <DragOverlay>{activeCard && <TaskCardOverlay card={activeCard} />}</DragOverlay>
 * </DndContext>
 * ```
 */
export function useDragAndDrop({
  cards,
  onMoveCard,
}: UseDragAndDropOptions): UseDragAndDropReturn {
  // 当前正在拖拽的卡片，用于 DragOverlay 渲染
  const [activeCard, setActiveCard] = useState<JobCard | null>(null);

  // 配置拖拽传感器：PointerSensor 支持鼠标和触摸
  // activationConstraint: 移动 8px 后才触发拖拽，避免误触（比如点击时手抖）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  /**
   * 拖拽开始处理器
   * 记录当前拖拽的卡片，用于 DragOverlay 渲染
   */
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const cardId = event.active.id as string;
      const card = cards.find((c) => c.id === cardId);
      setActiveCard(card ?? null);
    },
    [cards]
  );

  /**
   * 拖拽结束处理器
   * @param event.active - 被拖拽的元素（TaskCard），id 是 card.id
   * @param event.over - 放置目标（KanbanColumn），id 是 column.id
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // 清除拖拽状态
      setActiveCard(null);

      // 如果没有放置目标（拖到空白处），不做任何操作
      if (!over) return;

      const cardId = active.id as string;
      const targetColumnId = over.id as string;

      // 获取当前卡片所在的列
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      // 如果拖到了同一列，不做操作
      if (card.statusId === targetColumnId) return;

      // 调用业务逻辑：移动卡片到新列
      onMoveCard(cardId, targetColumnId);
    },
    [cards, onMoveCard]
  );

  return {
    sensors,
    handleDragStart,
    handleDragEnd,
    activeCard,
  };
}
