import React, { useMemo } from 'react';
import { 
  format, 
  isSameDay, 
  subDays, 
  addDays, 
  startOfDay, 
  eachDayOfInterval 
} from 'date-fns';

// Define the structure of the status object
export interface DateStatus {
  date: Date;
  hasData: boolean;
  isAllDone: boolean;
}

interface Props {
  // Changed from dates: Date[] to datesStatus: DateStatus[]
  datesStatus?: DateStatus[]; 
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export const Timeline: React.FC<Props> = ({ datesStatus = [], selectedDate, onSelect }) => {
  
  const visibleDays = useMemo(() => {
    const today = startOfDay(new Date());
    const start = subDays(today, 7);
    const end = addDays(today, 7);

    // Future dates at Top (Index 0), Past dates at Bottom
    return eachDayOfInterval({ start, end }).reverse();
  }, []);

  return (
    <div className="bg-[#161618] border border-[#27272a] rounded-xl p-5 flex flex-col h-auto">
      <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">Timeline</h2>
      
      <div className="space-y-1 flex-1">
        {visibleDays.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          
          // Find the status object for this specific day
          const status = datesStatus.find(s => isSameDay(s.date, date));
          const hasData = status?.hasData;
          const isAllDone = status?.isAllDone;

          // Determine Dot Color Logic
          let dotClass = 'bg-zinc-800'; // Default (Empty)

          if (isSelected) {
            // If selected, always show glowing primary color
            dotClass = 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]';
          } else if (hasData) {
            // If not selected but has data: Blue if done, Amber if pending
            dotClass = isAllDone ? 'bg-[#3b82f6]' : 'bg-amber-500';
          }

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
              
              <div className={`w-2 h-2 rounded-full transition-all ${dotClass}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};