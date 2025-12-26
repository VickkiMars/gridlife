import React from 'react';

const DashboardPreview: React.FC = () => {
  return (
    <div className="mt-20 relative max-w-5xl mx-auto px-4">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 dark:opacity-30" />
      <div className="relative bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-xl shadow-2xl overflow-hidden aspect-[16/9] grid grid-cols-4 grid-rows-3 gap-px bg-[#E5E5E5] dark:bg-[#262626]">
        {/* Main Chart Area */}
        <div className="col-span-3 row-span-2 bg-white dark:bg-black p-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10" />
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider">Real-time Velocity</span>
            </div>
          </div>
          <div className="w-full h-48 flex items-end justify-between gap-1">
            {[30, 50, 45, 70, 85, 95, 60, 40, 35].map((h, i) => (
              <div 
                key={i} 
                className={`w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 rounded-t-sm ${i === 5 ? 'from-red-500/20 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`} 
                style={{ height: `${h}%` }} 
              />
            ))}
          </div>
        </div>
        {/* ... Secondary Cards (Score, Focus Blocks, etc) would follow the same pattern ... */}
      </div>
    </div>
  );
};

export default DashboardPreview;