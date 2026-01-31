'use client';

import React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { useBoardContext } from './context/BoardContext';
import { useDragAndDrop } from './hooks/useDragAndDrop';

/**
 * 看板容器组件
 * 
 * 拖拽架构说明：
 * - DndContext：拖拽系统的根，管理所有拖拽状态
 * - DragOverlay：在 document 级别渲染拖拽中的卡片，确保始终在最上层
 * - useDragAndDrop：封装了拖拽逻辑（sensors、事件处理、activeCard 状态）
 */
export function KanbanBox() {
  const { board, handleMoveCard } = useBoardContext();
  const sortedColumns = [...board.columns].sort((a, b) => a.order - b.order);

  // 使用封装的拖拽 hook
  const { sensors, handleDragStart, handleDragEnd, activeCard } = useDragAndDrop({
    cards: board.cards,
    onMoveCard: handleMoveCard,
  });

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="relative flex flex-1 min-h-0 w-full">
        <div className="scrollbar-thin-x flex flex-row flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden border rounded-3xl border-gray-400">
          {sortedColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={board.cards.filter((card) => card.statusId === column.id)}
            />
          ))}
        </div>
        {/* 左右内侧淡淡灰黑色阴影，形成过渡遮蔽被隐藏的列（业界常见的边缘渐变阴影） */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10 rounded-l-3xl bg-gradient-to-r from-black/[0.08] to-transparent"
          aria-hidden
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10 rounded-r-3xl bg-gradient-to-l from-black/[0.08] to-transparent"
          aria-hidden
        />
      </div>

      {/* DragOverlay：在 document 级别渲染拖拽中的卡片，确保始终在最上层 */}
      <DragOverlay dropAnimation={null}>
        {activeCard && <TaskCard card={activeCard} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
