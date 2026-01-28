import { useTheme } from '../theme/ThemeContext';
import { TaskCard } from './TaskCard';

export function KanbanColumn() {

    const { text, font } = useTheme();
    return (
        <div className="flex flex-col flex-1 min-h-0 gap-4 w-full p-4 border-2 border-gray-500">
            <h3 className={`${font.heading} ${text.primary} text-lg font-bold`}>text</h3>
            <div className="flex flex-col gap-2">
                <TaskCard />
            </div>
        </div>
    )


}