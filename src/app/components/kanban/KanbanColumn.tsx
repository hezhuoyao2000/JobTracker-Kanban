import { useTheme } from '../theme/ThemeContext';
import { TaskCard } from './TaskCard';

export function KanbanColumn() {

    const { textClass } = useTheme();
    return (
        <div className="flex flex-col flex-1 gap-4 w-full h-auto p-4 border-2 border-gray-500">
            <h3 className={`${textClass} text-lg font-bold`}>text</h3>
            <div className="flex flex-col gap-2">
                <TaskCard />
            </div>
        </div>
    )


}