import React from 'react';
import { isSameDay } from 'date-fns';
import { COLORS } from '../../types/index';
import type { HeatmapDataPoint } from '../../types/index';

interface Props {
  data: HeatmapDataPoint[];
  selectedDate: Date;
  // FIX: Renamed from onCellClick to onSelect to match Home.tsx
  onSelect: (date: Date) => void;
}

export const MonthlyHeatmap: React.FC<Props> = ({ data, selectedDate, onSelect }) => {
  return (
    <div 
      className="border rounded-xl p-5 shadow-sm h-full flex flex-col min-h-[400px]"
      style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Output Heatmap</h2>
        <span className="text-xs cursor-pointer hover:underline" style={{ color: COLORS.primary }}>Full View</span>
      </div>
      
      <div className="grid grid-cols-5 gap-1.5 mb-6">
        {data.map((item) => {
          const isSelected = isSameDay(item.date, selectedDate);
          // Intensity 0-4
          const intensityLevel = Math.min(Math.max(item.intensity, 0), 4) as 0|1|2|3|4;
          
          return (
            <div
              key={item.date.toISOString()}
              // FIX: Using onSelect here
              onClick={() => onSelect(item.date)}
              className={`aspect-square rounded-sm cursor-pointer transition-all duration-300 border ${
                isSelected ? 'scale-105 z-10' : 'border-transparent hover:border-zinc-500'
              }`}
              style={{ 
                backgroundColor: COLORS.levels[intensityLevel],
                borderColor: isSelected ? COLORS.primary : undefined,
                boxShadow: isSelected ? `0 0 10px ${COLORS.primary}80` : 'none'
              }}
            />
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <span>Low</span>
          <div className="flex gap-1">
            {([0, 1, 2, 3, 4] as const).map(level => (
              <div 
                key={level} 
                className="w-2 h-2 rounded-px" 
                style={{ backgroundColor: COLORS.levels[level] }} 
              />
            ))}
          </div>
          <span>Peak</span>
        </div>
      </div>
    </div>
  );
};