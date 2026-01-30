'use client';

import Link from 'next/link';
import { Box } from '@/components/ui';
import { JobCard } from '../../services/types/frontendtypes/frontend';
import { useTheme } from '../theme/ThemeContext';
import { GripVertical, MapPin, Link as LinkIcon, CircleAlert, MessageCircle  } from 'lucide-react';
import { Divider } from '@/components/ui/divider';

export interface TaskCardProps {
  card: JobCard;
}

/**
 * 任务卡片组件
 * 根据 card 数据占位渲染，便于在此基础上手写样式。
 */
export function TaskCard({ card }: TaskCardProps) {
  const { text, font, themeClass } = useTheme();

  return (
    <Box
      className={`shrink-0 w-[17rem] min-h-[7.5rem] p-4 rounded-lg ${themeClass.cardBg} ${themeClass.cardBorder} border overflow-hidden flex flex-col transition-all duration-200 ease-out hover:-translate-y-0.5 ${themeClass.cardShadow}`}
    >
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2 min-h-0">
          {/* 职位标题 */}
          <div className={`min-w-0 flex-1 ${font.heading} ${text.primary} text-lg font-bold line-clamp-2 break-words`}>{card.jobTitle || '无标题'}</div>
          {/* 拖拽手柄 */}
          <GripVertical className={`w-4 h-4 shrink-0 mt-0.5 ${text.muted}`} aria-hidden />
        </div>
        {/* 公司名称 */}
        <div className={`min-w-0 truncate ${font.body} ${text.secondary} text-sm font-semibold`}>{card.companyName || ''}</div>



        {/* 标签容器 */}
        <div className="flex flex-wrap gap-1.5 min-h-0 my-1">
          {/* 工作地点 */}
          {card.jobLocation && (
            <div className={`flex items-center gap-1 shrink-0 ${themeClass.tagBg} px-2 rounded border ${themeClass.cardBorder}`}>
              <MapPin size={13} className={`${text.secondary}`} aria-hidden />
              <span className={`${font.body} font-semibold ${text.secondary} text-sm whitespace-nowrap`}>{card.jobLocation}</span>
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
      </div>
    </Box>
  );
}
