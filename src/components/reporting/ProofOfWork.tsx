import React, { useRef } from 'react';
import { format } from 'date-fns';
import { Download, Share2, Award, Zap, Target, Activity } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { DayEntry } from '../../types';
import { COLORS } from '../../types';

interface Props {
  entries: DayEntry[];
  range: { start: Date; end: Date };
  title?: string; // e.g. "2024 Wrapped" or "October Review"
  username?: string;
  onClose: () => void;
}

export const ProofOfWork: React.FC<Props> = ({ entries, range, title = "Year in Review", username = "Gridlife User", onClose }) => {
  const stats = useAnalytics(entries, range);
  const cardRef = useRef<HTMLDivElement>(null);

  // Simple Pie Chart Component
  const SimplePie = ({ data }: { data: typeof stats.categoryDistribution }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;

    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
        {data.map((d, i) => {
          const percent = d.value / total;
          const dash = percent * 314; // 2 * PI * R (R=50) -> Circumference approx 314
          const offset = cumulativePercent * 314;
          cumulativePercent += percent;
          
          return (
            <circle
              key={d.name}
              cx="50" cy="50" r="25" // r=25 means stroke-width=50 fills the center hole effectively
              fill="transparent"
              stroke={d.color}
              strokeWidth="50"
              strokeDasharray={`${dash} 314`}
              strokeDashoffset={-offset}
            />
          );
        })}
        {/* Inner Circle for Donut look */}
        <circle cx="50" cy="50" r="15" fill="#18181b" /> 
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="flex flex-col gap-4 max-w-2xl w-full">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Proof of Work Export</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 text-sm font-bold">
              <Download size={16} /> Save Image
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              Close
            </button>
          </div>
        </div>

        {/* THE CARD (Target for Screenshot/Export) */}
        <div 
          ref={cardRef}
          className="aspect-[4/5] sm:aspect-[1.91/1] w-full bg-zinc-950 rounded-xl border border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl"
          style={{ 
            background: `radial-gradient(circle at top right, #3b82f615, transparent 40%), radial-gradient(circle at bottom left, #6366f115, transparent 40%), #09090b`
          }}
        >
          {/* Watermark / Background Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
          />

          {/* Header */}
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  <Activity size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Gridlife.io</span>
              </div>
              <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">{title} • {format(new Date(), 'yyyy')}</p>
            </div>
            <div className="text-right">
              <h3 className="text-4xl font-black text-white">{stats.percentile}<span className="text-lg text-blue-500">%</span></h3>
              <p className="text-xs text-zinc-400">Top Percentile</p>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 my-8">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-xs uppercase font-mono mb-1">Consistency</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{stats.consistencyScore}%</span>
              </div>
            </div>
             <div className="flex flex-col">
              <span className="text-zinc-500 text-xs uppercase font-mono mb-1">Completed</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-green-400">{stats.completedTasks}</span>
                <span className="text-xs text-zinc-500">Tasks</span>
              </div>
            </div>
             <div className="flex flex-col">
              <span className="text-zinc-500 text-xs uppercase font-mono mb-1">Best Streak</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-yellow-400">{stats.longestStreak}</span>
                <span className="text-xs text-zinc-500">Days</span>
              </div>
            </div>
             <div className="flex flex-col">
              <span className="text-zinc-500 text-xs uppercase font-mono mb-1">Top Focus</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-indigo-400 truncate">{stats.topCategory}</span>
              </div>
            </div>
          </div>

          {/* Lower Section: Pie & Heatmap */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
            
            {/* Category Pie */}
            <div className="col-span-1 flex flex-col gap-3">
               <div className="flex items-center gap-4">
                  <SimplePie data={stats.categoryDistribution} />
                  <div className="flex flex-col gap-1">
                    {stats.categoryDistribution.slice(0,3).map(c => (
                      <div key={c.name} className="flex items-center gap-2 text-xs text-zinc-300">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Contribution Graph (Mini) */}
            <div className="col-span-1 sm:col-span-2 flex flex-col items-end">
              <div className="flex gap-0.5 items-end h-16 w-full opacity-80">
                {stats.heatmapData.slice(-40).map((d, i) => (
                   <div 
                      key={i} 
                      className="flex-1 rounded-sm min-w-[4px]"
                      style={{ 
                        height: `${Math.min(100, (d.intensity / 5) * 100)}%`,
                        backgroundColor: d.intensity > 0 ? '#3b82f6' : '#27272a'
                      }}
                   />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-2">LAST 40 DAYS ACTIVITY</p>
            </div>

          </div>

          {/* Footer */}
          <div className="relative z-10 mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-white font-bold">
                 {username.substring(0,2).toUpperCase()}
              </div>
              <span className="text-sm text-white font-medium">{username}</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Generated by Gridlife.io
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};