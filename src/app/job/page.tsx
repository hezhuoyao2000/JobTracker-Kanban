'use client';

import { KanbanBox } from '../components/kanban/KanbanBox';
import { FormEditWindow } from '../components/kanban/FormEditWindow';
import { PreviewWindow } from '../components/kanban/PreviewWindow';
import { useBoardContext } from '../components/kanban/context/BoardContext';
import { useTheme } from '../components/theme/ThemeContext';
import { ThemeSwitch } from '../components/theme/ThemeSwitch';
import { Divider } from '@/components/ui/divider';
import { AddNewButton } from '../components/kanban/AddNewButton';

export default function JobPage() {
  const { backgroundClass, text, themeClass, font } = useTheme();
  const { formInstanceId } = useBoardContext();

  return (
    <div className={`h-screen overflow-hidden ${backgroundClass} flex flex-col`}>
      <div className="flex-1 flex flex-col min-h-0 w-full max-w-screen-2xl mx-auto px-6 py-6 gap-4 overflow-hidden">
        <div className="flex justify-between items-center shrink-0">
          <h2 className={`${font.heading} ${text.primary} text-3xl font-bold`}>Job tracker</h2>
          <div className="flex items-center gap-6">
            <AddNewButton />
            <ThemeSwitch />
          </div>
        </div>
        <Divider orientation="horizontal" className={`shrink-0 border ${themeClass.divider}`} />
        <KanbanBox />
        <FormEditWindow key={formInstanceId} />
        <PreviewWindow />
      </div>
    </div>
  );
}
