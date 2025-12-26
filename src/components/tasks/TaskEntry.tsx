import React, { useState, useMemo } from 'react';
import { Check, Trash2 } from 'lucide-react'; // Import Lucide icons
import { COLORS, type Task } from '../../types';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAddTask: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskEntry: React.FC<Props> = ({ tasks, onToggle, onAddTask, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');

  const tagExplanations: Record<string, string> = {
    'WRK': 'Work',
    'PERS': 'Personal',
    'URG': 'Urgent',
    'DEV': 'Development',
    'OPS': 'Operations'
  };

  const existingTags = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.tag || 'WRK')));
  }, [tasks]);

  const handleSave = () => {
    if (!newTitle.trim()) {
      setIsAdding(false);
      return;
    }

    const newTask: Task = {
      id: (tasks.length + 1).toString().padStart(3, '0'),
      title: newTitle.trim(),
      tag: newTag.trim().toUpperCase() || 'WRK',
      completed: false,
      date: new Date(), 
    };

    onAddTask(newTask);
    setNewTitle('');
    setNewTag('');
    setIsAdding(false);
  };

  return (
    <div 
      className="rounded-xl shadow-sm overflow-hidden border"
      style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
    >
      {/* Table Header */}
      <div 
        className="grid grid-cols-12 px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider border-b"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: COLORS.border }}
      >
        <div className="col-span-1 text-center">Done</div>
        <div className="col-span-1 text-center">ID</div>
        <div className="col-span-7">Task Description</div>
        <div className="col-span-3 text-center">Tag</div>
      </div>

      {/* Inline Input Bar */}
      {isAdding && (
        <div className="grid grid-cols-12 px-6 py-4 items-center border-b animate-in fade-in" style={{ borderColor: COLORS.primary, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <div className="col-span-1 flex justify-center">
            <div className="w-5 h-5 rounded-full border border-dashed border-gray-600" />
          </div>
          <div className="col-span-1 text-center font-mono text-xs" style={{ color: COLORS.primary }}>
            {String(tasks.length + 1).padStart(3, '0')}
          </div>
          <div className="col-span-7 px-2">
            <input
              autoFocus
              className="bg-transparent border-none outline-none text-sm text-gray-100 w-full placeholder:text-gray-600"
              placeholder="Task name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div className="col-span-3 flex gap-2 items-center justify-center">
            <input
              list="task-tags"
              className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-blue-300 outline-none text-center"
              placeholder="TAG"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <datalist id="task-tags">
              {existingTags.map(tag => <option key={tag} value={tag}>{tagExplanations[tag] || 'Custom'}</option>)}
            </datalist>
            <button onClick={handleSave} className="text-blue-500 hover:text-blue-400">
              <Check size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Task Rows */}
      <div className="max-h-[500px] overflow-y-auto no-scrollbar">
        {tasks.map((task, idx) => (
          <div 
            key={task.id} 
            className="grid grid-cols-12 px-6 py-4 items-center transition-colors group relative border-b last:border-b-0 hover:bg-white/5"
            style={{ borderColor: COLORS.border }}
          >
            {/* Round Checkbox Column */}
            <div className="col-span-1 flex justify-center z-10">
              <div 
                onClick={() => onToggle(task.id)}
                className={`
                  w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200
                  ${task.completed 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-zinc-600 hover:border-blue-400 bg-transparent'
                  }
                `}
              >
                {task.completed && (
                  <Check size={12} strokeWidth={4} className="text-white" />
                )}
              </div>
            </div>
            
            <div className="col-span-1 text-center font-mono text-xs" style={{ color: task.completed ? '#4b5563' : COLORS.primary }}>
              {String(idx + 1).padStart(3, '0')}
            </div>
            
            <div className="col-span-7 cursor-pointer" onClick={() => onToggle(task.id)}>
              <span className={`text-sm transition-all ${task.completed ? 'text-gray-500 line-through opacity-60' : 'text-gray-100 font-medium'}`}>
                {task.title}
              </span>
            </div>

            {/* Tag + Delete Column */}
            <div className="col-span-3 flex justify-center items-center relative">
              <span className="px-2 py-1 rounded text-[10px] font-mono border group-hover:mr-6 transition-all duration-200"
                style={{ 
                  backgroundColor: task.completed ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                  color: task.completed ? '#4b5563' : '#93c5fd',
                  borderColor: task.completed ? COLORS.border : 'rgba(59, 130, 246, 0.3)'
                }}
              >
                {task.tag || 'WRK'}
              </span>

              {/* Delete Button - Appears on Hover */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div onClick={() => setIsAdding(true)} className="grid grid-cols-12 px-6 py-4 items-center cursor-pointer hover:bg-white/5 transition-colors">
        <div className="col-span-1 text-center font-mono text-xs text-gray-600">+</div>
        <div className="col-span-11 text-sm text-gray-400 font-mono">Click to add entry...</div>
      </div>
    </div>
  );
};