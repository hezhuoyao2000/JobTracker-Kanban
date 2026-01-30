import { Column, JobCard } from '../../services/types/frontendtypes/frontend';
import { useTheme } from '../theme/ThemeContext';
import { TaskCard } from './TaskCard';

export interface KanbanColumnProps {
  column: Column;
  cards: JobCard[];
}

/**
 * 看板列组件
 * 根据 column 配置渲染标题，按 cards 遍历渲染卡片。预留后续可传入自定义属性、拖拽等扩展。
 */
export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const { text, font, themeClass } = useTheme();

  return (
    <div className="flex flex-col min-h-0 gap-4 w-auto shrink-0 px-3 py-4">
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

      {/* 卡片列表 */}
      <div
        className="column-cards-scroll scrollbar-thin-y flex flex-col items-center gap-2 flex-1 min-h-0 overflow-y-auto pt-1"
        data-container="column-cards-scroll"
        aria-label={`卡片列表`}
      >
        {cards.map((card) => (
          <TaskCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}