import React, { useState, useMemo } from 'react';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfYear, endOfYear, eachDayOfInterval, isSameDay, format 
} from 'date-fns';
import { COLORS, type HeatmapDataPoint } from '../../types/index';

/**
 * Maps a 0.0 - 1.0 performance score to the 5-step green scale.
 * Note: Your COLORS.performanceScale starts with Lightest [0] and ends with Darkest [4].
 */
const getPerformanceColor = (performanceScore: number = 0, isGhost: boolean = false): string => {
  if (performanceScore === 0 && !isGhost) return COLORS.performanceScale[5]; // Empty gray

  // Mapping logic: Low score = Light Green [0], High score = Darkest Green [4]
  let baseColor: string;
  if (performanceScore < 0.2) baseColor = COLORS.performanceScale[0];
  else if (performanceScore < 0.4) baseColor = COLORS.performanceScale[1];
  else if (performanceScore < 0.6) baseColor = COLORS.performanceScale[2];
  else if (performanceScore < 0.8) baseColor = COLORS.performanceScale[3];
  else baseColor = COLORS.performanceScale[4];

  // Return semi-transparent ghost green for recovered days
  if (isGhost) {
    return baseColor + '80'; // Adds 50% alpha transparency
  }

  return baseColor;
};

const createDataMap = (data: HeatmapDataPoint[]) => {
  const map = new Map<string, { performanceScore: number; isGhost: boolean; overlayScores?: Record<string, number>; riskLevel?: HeatmapDataPoint['riskLevel'] }>();
  data.forEach(d => {
    map.set(format(d.date, 'yyyy-MM-dd'), { 
      performanceScore: d.performanceScore || 0,
      isGhost: d.isGhost || false,
      overlayScores: d.overlayScores,
      riskLevel: d.riskLevel || 'none'
    });
  });
  return map;
};

interface Props {
  data: HeatmapDataPoint[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
  burnoutRiskPercent?: number;
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
                      <div key={dateKey} className="relative">
                        <HeatmapCell 
                          date={date}
                          performanceScore={dayData?.performanceScore ?? 0}
                          isGhost={dayData?.isGhost ?? false}
                          overlayScores={dayData?.overlayScores}
                          riskLevel={dayData?.riskLevel}
                          isSelected={isSameDay(date, selectedDate)}
                          onSelect={onSelect}
                          size="small"
                        />
                        {/* Overlay visual: render blended layers on top when overlayScores present */}
                        {dayData?.overlayScores && (
                          <div className="absolute inset-0 pointer-events-none">
                            <OverlayHeatmapCell overlayScores={dayData.overlayScores} sizeCls="w-[13px] h-[13px] rounded-[2px]" />
                          </div>
                        )}
                      </div>
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
                      <div className="relative">
                        <HeatmapCell 
                          date={date}
                          performanceScore={dayData?.performanceScore ?? 0}
                          isGhost={dayData?.isGhost ?? false}
                          overlayScores={dayData?.overlayScores}
                          riskLevel={dayData?.riskLevel}
                          isSelected={isSameDay(date, selectedDate)}
                          onSelect={onSelect}
                          size="normal"
                        />
                        {dayData?.overlayScores && (
                          <div className="absolute inset-0 pointer-events-none">
                            <OverlayHeatmapCell overlayScores={dayData.overlayScores} sizeCls="aspect-square rounded-md" />
                          </div>
                        )}
                      </div>
                   </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="mt-auto pt-6 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
          <span>Performance Score (%):</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[5] }} />
            <span>0%</span>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[0] }} />
            <span>20%</span>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[1] }} />
            <span>40%</span>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[2] }} />
            <span>60%</span>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[3] }} />
            <span>80%</span>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[4] }} />
            <span>100%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <span>Legend:</span>
          <div className="w-2 h-2 rounded-sm border border-dashed" style={{ backgroundColor: COLORS.performanceScale[3] + '80' }} />
          <span>Ghost (Recovered)</span>
        </div>
      </div>
    </div>
  );
};

// --- Cell Component ---

interface CellProps {
  date: Date;
  performanceScore: number;
  isGhost: boolean;
  overlayScores?: Record<string, number>;
  riskLevel?: HeatmapDataPoint['riskLevel'];
  isSelected: boolean;
  onSelect: (date: Date) => void;
  size: 'normal' | 'small';
}

const HeatmapCell: React.FC<CellProps> = ({ date, performanceScore, isGhost, overlayScores, riskLevel, isSelected, onSelect, size }) => {
  const bgColor = getPerformanceColor(performanceScore, isGhost);
  const sizeClasses = size === 'normal' ? 'aspect-square rounded-md' : 'w-[13px] h-[13px] rounded-[2px]';
  const percentageDisplay = (performanceScore * 100).toFixed(0);
  const riskStyles: React.CSSProperties = {};
  if (riskLevel === 'high') {
    riskStyles.borderColor = 'rgba(124,58,237,0.7)';
    riskStyles.boxShadow = '0 0 8px rgba(124,58,237,0.35)';
  } else if (riskLevel === 'warning') {
    riskStyles.borderColor = 'rgba(234,179,8,0.6)';
    riskStyles.boxShadow = '0 0 6px rgba(234,179,8,0.18)';
  }

  return (
    <div
      onClick={() => onSelect(date)}
      title={`${format(date, 'MMM dd')}: ${percentageDisplay}% performance${isGhost ? ' (Recovered)' : ''}${riskLevel && riskLevel !== 'none' ? ` • Risk: ${riskLevel}` : ''}`}
      className={`
        ${sizeClasses}
        cursor-pointer transition-all duration-200 border
        ${isSelected ? 'scale-125 z-10 border-white/30' : 'border-transparent hover:border-white/10'}
        ${isGhost ? 'border-dashed' : ''}
      `}
      style={{ 
        backgroundColor: bgColor,
        ...(isSelected && {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: `0 0 8px ${bgColor}60`
        }),
        ...riskStyles
      }}
    />
  );
};

// If overlayScores are present, render multiple colored layers blended together
const OverlayHeatmapCell: React.FC<{ overlayScores?: Record<string, number>; sizeCls: string }> = ({ overlayScores, sizeCls }) => {
  if (!overlayScores) return null;
  const cats = Object.keys(overlayScores);
  return (
    <div className={`relative ${sizeCls}`} style={{ mixBlendMode: 'multiply' }}>
      {cats.map((c, i) => {
        const score = overlayScores[c];
        const color = getPerformanceColor(score, false);
        return (
          <div key={c} className="absolute inset-0 rounded-sm" style={{ backgroundColor: color, opacity: 0.7 - (i * 0.1) }} />
        );
      })}
    </div>
  );
};