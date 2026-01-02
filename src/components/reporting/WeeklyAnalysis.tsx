import React, { useState } from 'react';
import { subDays, startOfDay, isSunday, isMonday } from 'date-fns';
import { X, TrendingUp } from 'lucide-react'; // Removed unused Calendar, ArrowRight
import { useAnalytics } from '../../hooks/useAnalytics';
import type { DayEntry } from '../../types';
import { COLORS } from '../../types';

interface Props {
  entries: DayEntry[];
}

export const WeeklyAnalysis: React.FC<Props> = ({ entries }) => {
  const [isVisible, setIsVisible] = useState(true);
  const today = new Date();

  // Logic: Only show on Sunday or Monday
  const shouldShow = isSunday(today) || isMonday(today);

  // Calculate Last Week's Range (Last 7 days)
  const range = {
    start: startOfDay(subDays(today, 7)),
    end: startOfDay(today)
  };

  const stats = useAnalytics(entries, range);

  // Early return if not the right day or user dismissed it
  if (!shouldShow || !isVisible) return null;

  return (
    <div 
      className="col-span-12 mb-6 rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2 fade-in duration-500"
      style={{ backgroundColor: 'rgba(39, 39, 42, 0.4)', borderColor: COLORS.border }}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Weekly Pulse Check</h3>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            Your consistency ratio was <span className="text-white font-mono">{stats.consistencyScore}%</span> this week. 
            You were busiest on <span className="text-white font-mono">{stats.busiestDay}</span>.
            You outperformed <span className="text-blue-400 font-mono">{stats.percentile}%</span> of similar users.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
        <div className="flex flex-col">
           <span className="text-[10px] text-gray-500 uppercase tracking-widest">Least Busy</span>
           <span className="text-xs text-gray-300 font-mono">{stats.leastBusyDay}</span>
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] text-gray-500 uppercase tracking-widest">Tasks</span>
           <span className="text-xs text-gray-300 font-mono">{stats.completedTasks} Done</span>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-auto sm:ml-0 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};