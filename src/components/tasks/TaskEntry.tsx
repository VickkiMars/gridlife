import React, { useState, useMemo } from 'react';
import { Check, Trash2 } from 'lucide-react'; // Import Lucide icons
import { COLORS, type Task } from '../../types';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAddTask: (task: Task) => void;
  onDelete: (id: string) => void;
  burnoutRiskPercent?: number;
}

export const TaskEntry: React.FC<Props> = ({ tasks, onToggle, onAddTask, onDelete, burnoutRiskPercent = 0 }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newWeight, setNewWeight] = useState(3); // Default weight

  const tagExplanations: Record<string, string> = {
    'WRK': 'Work',
    'PERS': 'Personal',
    'URG': 'Urgent',
    'DEV': 'Development',
    'OPS': 'Operations'
  };

  const existingCategories = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => (t as any).category_id || 'General')));
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
      weight: newWeight,
      category_id: newCategory.trim() || 'General',
    };

    onAddTask(newTask);
    setNewTitle('');
    setNewTag('');
    setNewCategory('General');
    setNewWeight(3);
    setIsAdding(false);
  };

  return (
    <div 
      className="rounded-xl shadow-sm overflow-hidden border"
      style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
    >
      {/* Table Header */}
      <div 
        className="grid grid-cols-10 sm:grid-cols-12 px-3 sm:px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider border-b gap-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderColor: COLORS.border }}
      >
        <div className="col-span-1 text-center">Done</div>
        <div className="hidden sm:block sm:col-span-1 text-center">ID</div>
        <div className="col-span-6 sm:col-span-6">Task</div>
        <div className="col-span-2 text-center">Weight</div>
        <div className="col-span-1 text-center">Tag</div>
      </div>

      {/* Inline Input Bar */}
      {isAdding && (
        <div className="grid grid-cols-10 sm:grid-cols-12 px-3 sm:px-6 py-3 items-center border-b animate-in fade-in gap-1" style={{ borderColor: COLORS.primary, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <div className="col-span-1 flex justify-center">
            <div className="w-5 h-5 rounded-full border border-dashed border-gray-600" />
          </div>
          <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs" style={{ color: COLORS.primary }}>
            {String(tasks.length + 1).padStart(3, '0')}
          </div>
          <div className="col-span-6 sm:col-span-6 px-1 sm:px-2">
            <input
              autoFocus
              className="bg-transparent border-none outline-none text-sm text-gray-100 w-full placeholder:text-gray-600"
              placeholder="Task name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          {/* Weight Slider - Mobile Optimized */}
          <div className="col-span-2 flex flex-col items-center justify-center gap-1">
            <input
              type="range"
              min="1"
              max="5"
              value={newWeight}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((newWeight - 1) / 4) * 100}%, #404040 ${((newWeight - 1) / 4) * 100}%, #404040 100%)`
              }}
            />
            <span className="text-xs font-mono text-blue-400 font-semibold">{newWeight}</span>
          </div>
          <div className="col-span-1 flex gap-1 items-center justify-center">
            <input
              list="task-categories"
              className="w-full sm:w-16 bg-black/20 border border-white/10 rounded px-1 sm:px-2 py-1 text-[10px] font-mono text-blue-300 outline-none text-center"
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
            <datalist id="task-categories">
              {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </datalist>
            <button onClick={handleSave} className="text-blue-500 hover:text-blue-400 flex-shrink-0">
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
            className="grid grid-cols-10 sm:grid-cols-12 px-3 sm:px-6 py-3 sm:py-4 items-center transition-colors group relative border-b last:border-b-0 hover:bg-white/5 gap-1"
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
            
            <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs" style={{ color: task.completed ? '#4b5563' : COLORS.primary }}>
              {String(idx + 1).padStart(3, '0')}
            </div>
            
            <div className="col-span-6 sm:col-span-6 cursor-pointer px-1" onClick={() => onToggle(task.id)}>
              <span className={`text-xs sm:text-sm transition-all ${task.completed ? 'text-gray-500 line-through opacity-60' : 'text-gray-100 font-medium'}`}>
                {task.title}
              </span>
            </div>

            {/* Weight Display - Mobile Optimized */}
            <div className="col-span-2 flex justify-center">
              <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(task.weight / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-gray-300 w-4 text-center">{task.weight}</span>
              </div>
            </div>

            {/* Tag + Delete Column */}
            <div className="col-span-1 flex justify-center items-center relative gap-1">
              <span className="px-1 sm:px-2 py-1 rounded text-[10px] font-mono border group-hover:mr-4 sm:group-hover:mr-6 transition-all duration-200 flex-shrink-0"
                style={{ 
                  backgroundColor: task.completed ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                  color: task.completed ? '#4b5563' : '#93c5fd',
                  borderColor: task.completed ? COLORS.border : 'rgba(59, 130, 246, 0.3)'
                }}
              >
                {(task as any).category_id || task.tag || 'WRK'}
              </span>

              {/* Delete Button - Appears on Hover */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="absolute right-2 sm:right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full flex-shrink-0"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      { (burnoutRiskPercent ?? 0) >= 80 ? (
        <div className="px-3 sm:px-6 py-4 flex items-center justify-center gap-3 border-t" style={{ borderColor: COLORS.border }}>
          <button
            onClick={() => alert('Schedule rest flow (placeholder)')}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Schedule Rest
          </button>
        </div>
      ) : (
        <div onClick={() => setIsAdding(true)} className="grid grid-cols-10 sm:grid-cols-12 px-3 sm:px-6 py-3 sm:py-4 items-center cursor-pointer hover:bg-white/5 transition-colors gap-1">
          <div className="col-span-1 text-center font-mono text-xs text-gray-600">+</div>
          <div className="col-span-9 sm:col-span-11 text-xs sm:text-sm text-gray-400 font-mono">Click to add entry...</div>
        </div>
      )}
    </div>
  );
};