import { Box } from '@/components/ui';
import { KanbanBox } from './components/kanban/kanbanBox';

/**
 * 主页组件
 * 任务流看板
 */
export default async function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#E3DCD0] to-[#D9C3A6]'>  
      <KanbanBox/>
    </div>
  );
}
