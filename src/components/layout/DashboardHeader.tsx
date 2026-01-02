import React from "react";
import { Upload, Download, Activity, Filter, Eye } from "lucide-react";
import { COLORS } from "../../types/index";

interface DashboardHeaderProps {
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  
  // Data for View Pane
  categories: string[];
  activeCategories: string[];
  setActiveCategories: (cats: string[]) => void; // setState action
  
  // Visual Modes
  viewMode: 'volume' | 'integrity'; // Replaces 'shadowMode'
  setViewMode: (mode: 'volume' | 'integrity') => void;
  
  // Actions
  onImport: (file: File) => void;
  onExport: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalTasks,
  completedTasks,
  currentStreak,
  categories,
  activeCategories,
  setActiveCategories,
  viewMode,
  setViewMode,
  onImport,
  onExport
}) => {

  const toggleCategory = (cat: string) => {
    // Logic: Multi-select enabled by default
    if (activeCategories.includes(cat)) {
      setActiveCategories(activeCategories.filter(c => c !== cat));
    } else {
      setActiveCategories([...activeCategories, cat]);
    }
  };

  return (
    <header className="max-w-[1600px] mx-auto mb-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500">
      
      {/* 1. Top Bar: Brand & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #6366f1)` }}
          >
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Gridlife.io</h1>
            <p className="text-xs text-gray-500 font-mono">Productivity Visualization Engine</p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800">
          <div className="px-3 py-1 text-xs text-gray-400 border-r border-zinc-800">
            Total <span className="text-white font-mono ml-1">{totalTasks}</span>
          </div>
          <div className="px-3 py-1 text-xs text-gray-400 border-r border-zinc-800">
            Done <span className="text-green-400 font-mono ml-1">{completedTasks}</span>
          </div>
          <div className="px-3 py-1 text-xs text-gray-400">
            Streak <span className="text-yellow-400 font-mono ml-1">{currentStreak}d</span>
          </div>
        </div>
      </div>

      {/* 2. The "View" Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Section A: Category Filter (The Pilled Chips) */}
        <div 
          className="lg:col-span-8 p-4 rounded-xl border flex flex-col gap-3"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider">
            <Filter size={12} />
            <span>View Completed Tasks by Category</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* "All" Chip */}
            <button
              onClick={() => setActiveCategories([])}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                ${activeCategories.length === 0 
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                  : 'bg-transparent text-gray-500 border-zinc-700 hover:border-zinc-500 hover:text-gray-300'
                }
              `}
            >
              All
            </button>

            {/* Dynamic Category Chips */}
            {categories.map(cat => {
              const isActive = activeCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                    ${isActive
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      : 'bg-transparent text-gray-500 border-zinc-700 hover:border-zinc-500 hover:text-gray-300'
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
            
            {categories.length === 0 && (
              <span className="text-xs text-zinc-600 italic py-1.5">No categories found. Add a task with a category to start filtering.</span>
            )}
          </div>
        </div>

        {/* Section B: Visualization Mode (View Days I Worked) */}
        <div 
          className="lg:col-span-4 p-4 rounded-xl border flex flex-col gap-3"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-wider">
              <Eye size={12} />
              <span>Metric</span>
            </div>
            {/* Tiny "Active Legend" / Helper Text */}
            <span className="text-[10px] text-gray-600 italic">
              {viewMode === 'volume' ? 'Intensity of work' : 'Plan vs. Reality'}
            </span>
          </div>

          <div className="bg-zinc-900 p-1 rounded-lg border border-zinc-800 flex items-center h-full">
            <button
              onClick={() => setViewMode('volume')}
              className={`flex-1 h-full rounded-md text-xs font-mono transition-all flex items-center justify-center gap-2 ${
                viewMode === 'volume' 
                  ? 'bg-zinc-700 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setViewMode('integrity')}
              className={`flex-1 h-full rounded-md text-xs font-mono transition-all flex items-center justify-center gap-2 ${
                viewMode === 'integrity' 
                  ? 'bg-zinc-700 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              Integrity
              {/* Optional: Indicator dot */}
              <span className={`w-1.5 h-1.5 rounded-full ${viewMode === 'integrity' ? 'bg-green-400' : 'bg-zinc-600'}`}></span>
            </button>
          </div>
        </div>

      </div>

      {/* Hidden Import/Export Logic (Kept accessible but unobtrusive, or move to a settings modal later) */}
      <div className="flex justify-end gap-2">
         <label className="text-[10px] text-gray-500 hover:text-white cursor-pointer transition-colors flex items-center gap-1">
            <Upload size={10} /> Import JSON
            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
         </label>
         <button onClick={onExport} className="text-[10px] text-gray-500 hover:text-white cursor-pointer transition-colors flex items-center gap-1">
            <Download size={10} /> Export JSON
         </button>
      </div>

    </header>
  );
};