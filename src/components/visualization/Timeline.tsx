import React from 'react';
import { format, isSameDay } from 'date-fns';

interface Props {
  dates: Date[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export const Timeline: React.FC<Props> = ({ dates, selectedDate, onSelect }) => {
  return (
    <div className="bg-[#161618] border border-[#27272a] rounded-xl p-5 flex flex-col h-[480px]">
      <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">Timeline</h2>
      <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <div
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20' 
                  : 'hover:bg-zinc-800/50 text-gray-500 border-transparent'
              }`}
            >
              <span className="text-sm font-display tracking-tight">
                {format(date, "EEE, MMM dd")}
              </span>
              <div className={`w-2 h-2 rounded-full transition-shadow ${
                isSelected 
                  ? 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
                  : 'bg-zinc-700'
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};