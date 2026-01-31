'use client';

import { useDraggable } from '@dnd-kit/core';
import Link from 'next/link';
import { JobCard } from '../../services/types/frontendtypes/frontend';
import { useTheme } from '../theme/ThemeContext';
import { useBoardContext } from './context/BoardContext';
import { GripVertical, MapPin, Link as LinkIcon, CircleAlert, MessageCircle, SquarePen } from 'lucide-react';
import { Divider } from '@/components/ui/divider';

export interface TaskCardProps {
  card: JobCard;
  /** 是否是 DragOverlay 中的预览卡片（不需要拖拽功能） */
  isOverlay?: boolean;
}

/**
 * 任务卡片组件
 * 
 * 拖拽说明：
 * - useDraggable：让这个卡片可以被拖拽
 * - id：使用 card.id，这样 onDragEnd 的 active.id 就是卡片的 id
 * - listeners：拖拽事件监听器，绑定到手柄图标上（只有按住手柄才能拖拽）
 * - isDragging：是否正在被拖拽，原位置卡片变为占位符样式
 * - isOverlay：如果是 DragOverlay 中的卡片，不需要拖拽功能，显示拖拽中的高亮样式
 */
export function TaskCard({ card, isOverlay = false }: TaskCardProps) {
  const { openCard } = useBoardContext();
  const { text, font, themeClass } = useTheme();

  // useDraggable：让这个卡片可以被拖拽
  // isOverlay 的卡片不需要拖拽功能
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    disabled: isOverlay,
  });

  // 根据状态决定样式
  const getCardClassName = () => {
    const base = `shrink-0 w-[17rem] min-h-[7.5rem] p-4 rounded-lg border overflow-hidden flex flex-col transition-shadow duration-200 ease-out`;
    
    if (isOverlay) {
      // DragOverlay 中的卡片：高亮样式，始终在最上层
      return `${base} ${themeClass.cardBg} ${themeClass.cardBorder} shadow-2xl ring-2 ring-blue-400 scale-105`;
    }
    
    if (isDragging) {
      // 原位置的占位符：半透明虚线边框
      return `${base} opacity-40 border-dashed border-2 border-gray-400 bg-gray-100`;
    }
    
    // 正常状态
    return `${base} ${themeClass.cardBg} ${themeClass.cardBorder} ${themeClass.cardShadow} hover:-translate-y-0.5`;
  };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      className={getCardClassName()}
    >
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2 min-h-0">
          {/* 职位标题 */}
          <div className={`min-w-0 flex-1 ${font.heading} ${text.primary} text-lg font-bold line-clamp-2 break-words cursor-pointer hover:underline`} onClick={() => openCard(card.id)}>{card.jobTitle || '无标题'}</div>
          {/* 拖拽手柄 - listeners 绑定到这里，只有按住手柄才能拖拽 */}
          <GripVertical
            {...listeners}
            {...attributes}
            className={`w-4 h-4 shrink-0 mt-0.5 ${text.muted} hover:cursor-grab active:cursor-grabbing touch-none`}
            aria-hidden
          />
        </div>
        {/* 公司名称 */}
        <div className={`min-w-0 truncate ${font.body} ${text.secondary} text-sm font-semibold`}>{card.companyName || ''}</div>

        {/* 标签容器 */}
        <div className="flex flex-wrap gap-1.5 min-h-0 my-1">
          {/* 工作地点 */}
          {card.jobLocation && (
            <div className={`flex items-center gap-1 shrink-0 max-w-[10rem] ${themeClass.tagBg} px-2 rounded border ${themeClass.cardBorder}`}>
              <MapPin size={13} className={`shrink-0 ${text.secondary}`} aria-hidden />
              <span className={`${font.body} font-semibold ${text.secondary} text-sm truncate`}>{card.jobLocation}</span>
            </div>
          )}

          {/* 职位链接：Link 包裹以支持左键跳转、右键“新标签页打开”等完整链接行为 */}
          {card.jobLink && (
            <Link
              href={card.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 shrink-0 px-2 rounded border ${themeClass.cardBorder} ${themeClass.tagBg} hover:opacity-90 ${text.link}`}
            >
              <LinkIcon size={13} className="shrink-0" aria-hidden />
              <span className={`${font.body} font-medium text-sm whitespace-nowrap truncate max-w-[8rem]`}>From {card.sourcePlatform}</span>
            </Link>
          )}

          {/* 标签 */}
          {card.tags?.map((tag) => (
            <div key={tag} className={`shrink-0 px-2 rounded border ${themeClass.cardBorder} ${themeClass.tagBg}`}>
              <span className={`${font.body} ${text.secondary} text-sm whitespace-nowrap`}>{tag}</span>
            </div>
          ))}

          {card.extra?.contactInfo && (
            <div className={`shrink-0 px-2 rounded border ${themeClass.cardBorder} ${themeClass.tagBg}`}>
              <span className={`${font.body} ${text.secondary} text-sm whitespace-nowrap`}>{card.extra.contactInfo}</span>
            </div>
          )}
        </div>
        <Divider orientation="horizontal" className={`shrink-0 ${themeClass.divider}`} />
        {/* 过期状态 */}
        <div className={`flex items-center gap-1 shrink-0 w-fit ${themeClass.tagBg} px-2 rounded border ${themeClass.cardBorder}`}>
          <CircleAlert size={13} className={`${text.secondary}`} aria-hidden />
          <span className={`${font.body} font-semibold ${text.secondary} text-sm whitespace-nowrap`}>{card.expired ? 'Expired' : 'Valid'}</span>
        </div>

        {/* 自定义注释 */}
        {card.comments && (
          <div className={`shrink-0 w-fit max-w-full ${themeClass.tagBg} px-2 rounded border ${themeClass.cardBorder}`}>
            <p className={`m-0 ${font.body} font-semibold ${text.secondary} text-sm line-clamp-2 break-words`}>
              <MessageCircle size={13} className={`inline-block align-middle shrink-0 mr-1 w-[13px] h-[13px] ${text.secondary}`} aria-hidden />
              {card.comments}
            </p>
          </div>
        )}
        
        <div className="self-end shrink-0">
          <SquarePen size={18} className={`${text.secondary} mt-1 hover:cursor-pointer hover:opacity-80`} aria-hidden onClick={() => openCard(card.id)} />
        </div>

      </div>
    </div>
  );
}
