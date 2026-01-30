import React from "react";
import { KanbanColumn } from './KanbanColumn';
import { useBoard } from './hooks/useBoard';

/**
 * 看板容器组件
 * 使用 board.columns 配置按 order 排序后遍历渲染列，预留后续列可自定义、可拖动排序的扩展空间。
 */
export function KanbanBox() {
  const { board } = useBoard();

  const sortedColumns = [...board.columns].sort((a, b) => a.order - b.order);

  return (
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
  );
}
