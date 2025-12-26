import React, { useState, useMemo } from 'react';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfYear, endOfYear, eachDayOfInterval, isSameDay, format 
} from 'date-fns';
import { COLORS } from '../../types/index';

// Extended interface to support the completion status
export interface HeatmapDataPoint {
  date: Date;
  intensity: number;
  isAllDone: boolean; // New prop
}

const getIntensityColor = (intensity: number = 0, isAllDone: boolean): string => {
  const safeIntensity = Math.min(Math.max(Math.round(intensity), 0), 4) as 0|1|2|3|4;
  
  if (safeIntensity === 0) return COLORS.levels[0];

  // If fully done, use standard (Blue/Primary) scale
  if (isAllDone) {
    return COLORS.levels[safeIntensity];
  }

  // If pending, use an "Amber/Warning" scale (Hardcoded for "Google-style" utility)
  // Level 1-4 mapped to Amber opacities
  const pendingColors = {
    1: '#fef3c7', // amber-100
    2: '#fde68a', // amber-200
    3: '#f59e0b', // amber-500
    4: '#b45309', // amber-700
  };
  
  return pendingColors[safeIntensity] || pendingColors[1];
};

const createDataMap = (data: HeatmapDataPoint[]) => {
  const map = new Map<string, { intensity: number, isAllDone: boolean }>();
  data.forEach(d => {
    map.set(format(d.date, 'yyyy-MM-dd'), { 
      intensity: d.intensity, 
      isAllDone: d.isAllDone 
    });
  });
  return map;
};

interface Props {
  data: HeatmapDataPoint[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export const MonthlyHeatmap: React.FC<Props> = ({ data, selectedDate, onSelect }) => {
  const [isFullView, setIsFullView] = useState(false);
  const dataMap = useMemo(() => createDataMap(data), [data]);

  const calendarDays = useMemo(() => {
    if (isFullView) {
      return eachDayOfInterval({
        start: startOfYear(selectedDate),
        end: endOfYear(selectedDate)
      });
    }
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(selectedDate)),
      end: endOfWeek(endOfMonth(selectedDate))
    });
  }, [selectedDate, isFullView]);

  return (
    <div 
      className={`border rounded-xl p-5 shadow-sm flex flex-col transition-all duration-500 ease-in-out ${
        isFullView ? 'h-auto' : 'h-full min-h-[400px]'
      }`}
      style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider">
          {isFullView ? `Yearly Status • ${format(selectedDate, 'yyyy')}` : 'Monthly Status'}
        </h2>
        <button 
          onClick={() => setIsFullView(!isFullView)}
          className="text-xs font-medium transition-colors hover:text-white" 
          style={{ color: COLORS.primary }}
        >
          {isFullView ? 'Show Month' : 'Full View'}
        </button>
      </div>
      
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        {isFullView ? (
          <div className="flex gap-1 min-w-max pb-4">
             {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                    const dayIndex = (weekIndex * 7) + dayOfWeek;
                    const date = calendarDays[dayIndex];
                    if (!date) return <div key={dayOfWeek} className="w-[13px] h-[13px]" />;

                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayData = dataMap.get(dateKey);
                    
                    return (
                      <HeatmapCell 
                        key={dateKey}
                        date={date}
                        intensity={dayData?.intensity}
                        isAllDone={dayData?.isAllDone ?? false}
                        isSelected={isSameDay(date, selectedDate)}
                        onSelect={onSelect}
                        size="small"
                      />
                    );
                  })}
                </div>
             ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-[10px] text-center text-gray-600 font-mono">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {calendarDays.map((date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const dayData = dataMap.get(dateKey);
                
                return (
                   <div key={dateKey} className={date.getMonth() !== selectedDate.getMonth() ? 'opacity-30' : ''}>
                      <HeatmapCell 
                        date={date}
                        intensity={dayData?.intensity}
                        isAllDone={dayData?.isAllDone ?? false}
                        isSelected={isSameDay(date, selectedDate)}
                        onSelect={onSelect}
                        size="normal"
                      />
                   </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* New Legend */}
      <div className="mt-auto pt-6 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-amber-500" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.levels[4] }} />
            <span>Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Cell Component ---

interface CellProps {
  date: Date;
  intensity?: number;
  isAllDone: boolean;
  isSelected: boolean;
  onSelect: (date: Date) => void;
  size: 'normal' | 'small';
}

const HeatmapCell: React.FC<CellProps> = ({ date, intensity, isAllDone, isSelected, onSelect, size }) => {
  const bgColor = getIntensityColor(intensity, isAllDone);
  const sizeClasses = size === 'normal' ? 'aspect-square rounded-md' : 'w-[13px] h-[13px] rounded-[2px]';

  return (
    <div
      onClick={() => onSelect(date)}
      title={`${format(date, 'MMM dd')}: ${isAllDone ? 'Done' : 'Pending'}`}
      className={`
        ${sizeClasses}
        cursor-pointer transition-all duration-200 border
        ${isSelected ? 'scale-125 z-10 border-white/20' : 'border-transparent hover:border-white/10'}
      `}
      style={{ 
        backgroundColor: bgColor,
        ...(isSelected && {
          borderColor: isAllDone ? COLORS.primary : '#f59e0b', // Blue glow or Amber glow
          boxShadow: `0 0 8px ${isAllDone ? COLORS.primary : '#f59e0b'}60`
        })
      }}
    />
  );
};