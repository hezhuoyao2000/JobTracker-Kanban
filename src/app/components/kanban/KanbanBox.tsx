import React from "react";
import { DndContext } from "@dnd-kit/core";
import { Box } from '@/components/ui';
import { KanbanColumn } from './KanbanColumn';


/**
 * 看板容器组件
 * 任务流看板主容器
 */
export function KanbanBox() {
  return (
    <div className="flex flex-row gap-4 flex-1 min-h-0 w-full p-4 border rounded-3xl border-gray-400">
      <KanbanColumn />
      <KanbanColumn />
      <KanbanColumn />
    </div>
  );
}
