'use client';

import { useDroppable } from '@dnd-kit/core';
import { Column, JobCard } from '../../services/types/frontendtypes/frontend';
import { useTheme } from '../theme/ThemeContext';
import { TaskCard } from './TaskCard';

export interface KanbanColumnProps {
  column: Column;
  cards: JobCard[];
}

/**
 * 看板列组件
 * 
 * 拖拽说明：
 * - useDroppable：让这个列成为「可放置区域」
 * - id：使用 column.id，这样 onDragEnd 的 over.id 就是目标列的 id
 * - isOver：当有卡片悬停在此列上时为 true，用于视觉反馈
 */
export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const { text, font, themeClass, theme } = useTheme();

  // useDroppable：让这个列成为可放置区域
  // id 是 column.id，onDragEnd 时 over.id 就是这个值
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // 拖拽悬停时的半透明白色指示，与主题和谐
  const isOverStyles =
    theme === 'light'
      ? 'bg-white/25 ring-2 ring-white/50'
      : 'bg-white/12 ring-2 ring-white/30';

  return (
    <div className="flex flex-col min-h-0 gap-4 w-[19.5rem] shrink-0 px-3 py-4">
      <div className="flex items-center gap-3">
        {/* 列标题 */}
        <h3 className={`shrink-0 ${font.heading} ${text.primary} text-lg font-bold pl-3`}>
          {column.name}
        </h3>

        {/* 卡片数量 */}
        <span
          className={`shrink-0 min-w-[1.5rem] px-2 py-0.5 rounded-full text-center text-sm font-bold ${font.mono} ${text.secondary} ${themeClass.borderBg}`}
        >
          {cards.length}
        </span>
      </div>

      {/* 卡片列表 - 这是 Droppable 区域 */}
      <div
        ref={setNodeRef}
        className={`column-cards-scroll scrollbar-thin-y flex flex-col justify-start items-center gap-2 flex-1 min-h-0 w-[18rem] overflow-y-auto pt-1 rounded-xl transition-colors duration-200 ${
          isOver ? isOverStyles : ''
        }`}
        data-container="column-cards-scroll"
        aria-label={`cards`}
      >
        {cards.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-start gap-2 flex-1 w-full min-h-[5rem] pt-1`}
          >
            {/* 列头部虚线框占位，提示可放置卡片 */}
            <div
              className={`w-full min-h-[8rem] rounded-lg border-2 border-dashed ${themeClass.border} flex items-center justify-center ${text.muted}`}
            >
              <span className="text-sm">Drop card here</span>
            </div>
          </div>
        ) : (
          cards.map((card) => <TaskCard key={card.id} card={card} />)
        )}
      </div>
    </div>
  );
}