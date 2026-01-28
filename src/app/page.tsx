'use client';
import { KanbanBox } from './components/kanban/KanbanBox';
import { useTheme } from './components/theme/ThemeContext';
import { ThemeSwitch } from './components/theme/ThemeSwitch';
import {Divider} from '@/components/ui/divider';


/**
 * 主页组件
 * 任务流看板
 */
export default function Home() {
  const { backgroundClass, text, themeClass, font } = useTheme();

  return (
    <div className={`min-h-screen ${backgroundClass} flex flex-col`}>
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-screen-2xl mx-auto px-6 py-6 gap-4">
        <div className="flex justify-between items-center shrink-0">
          <h2 className={`${font.heading} ${text.primary} text-2xl font-bold`}>Job tracker</h2>
          <ThemeSwitch />
        </div>
        <Divider orientation="horizontal" className={`shrink-0 border-t-2 ${themeClass.divider}`} />
        <KanbanBox />
      </div>
    </div>
  );
}
