import React from 'react';
import { format } from 'date-fns';
import { type Task } from '../../types/index';

interface Props {
  date: Date;
  tasks: Task[];
}

export const TaskList: React.FC<Props> = ({ date, tasks }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-end justify-between">
      <h1 className="text-3xl font-bold tracking-tight">{format(date, "EEEE, MMMM dd")}</h1>
      <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] text-sm font-medium flex items-center gap-2">
        <span className="material-icons-round text-sm">add</span> New Task
      </button>
    </div>

    <div className="bg-surface-light dark:bg-[#161618] border border-border-light dark:border-[#27272a] rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-12 border-b border-border-light dark:border-[#27272a] bg-gray-50 dark:bg-zinc-900/50 px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">
        <div className="col-span-1 text-center">ID</div>
        <div className="col-span-8">Task Description</div>
        <div className="col-span-3 text-center">Tag</div>
      </div>

      {tasks.length > 0 ? tasks.map((task, idx) => (
        <div key={task.id} className="grid grid-cols-12 border-b border-border-light dark:border-[#27272a] px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
          <div className="col-span-1 text-center font-mono text-xs text-gray-500">
            {String(idx + 1).padStart(3, '0')}
          </div>
          <div className="col-span-8 text-sm text-gray-900 dark:text-gray-100">
            {task.title}
          </div>
          <div className="col-span-3 flex justify-center">
            <span className="px-2 py-1 rounded bg-purple-900/30 text-purple-300 text-xs font-mono border border-purple-800">
              {task.tag}
            </span>
          </div>
        </div>
      )) : (
        <div className="px-6 py-8 text-center text-gray-500 font-mono text-sm">
          No tasks logged for this heartbeat.
        </div>
      )}
      
      <div className="grid grid-cols-12 px-6 py-3 items-center hover:bg-gray-50 dark:hover:bg-zinc-800/30 cursor-pointer group transition-colors">
        <div className="col-span-1 text-center font-mono text-xs text-gray-600">+</div>
        <div className="col-span-11 text-sm text-gray-400 font-mono group-hover:text-[#3b82f6]">
          Click to add entry...
        </div>
      </div>
    </div>
  </div>
);