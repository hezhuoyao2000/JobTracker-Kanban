'use client';
import { KanbanBox } from './components/kanban/KanbanBox';
import { useTheme } from './components/theme/ThemeContext';
import { ThemeSwitch } from './components/theme/ThemeSwitch';



/**
 * 主页组件
 * 任务流看板
 */
export default function Home() {
  const { backgroundClass, textClass } = useTheme();



  return (
    <div className={`min-h-screen ${backgroundClass} flex justify-center`}>  
      <div className='w-full max-w-screen-2xl mx-auto px-6'>
        <div className='flex justify-between items-center py-7'>
          <h2 className={`font-geist-mono ${textClass} text-2xl font-bold`}>Job tracker</h2>     
          <ThemeSwitch />
        </div>

        <KanbanBox />
      </div>
    </div>
  );
}
