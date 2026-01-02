import React, { useState, useMemo } from 'react';
import { 
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfYear, endOfYear, eachDayOfInterval, isSameDay, format, subDays 
} from 'date-fns';
import { COLORS, type HeatmapDataPoint } from '../../types/index';

// Extends the base type to safely handle the specific metrics without 'as any' casting
interface ExtendedHeatmapDataPoint extends HeatmapDataPoint {
  integrityScore?: number;
  intentionVolume?: number;
  executionVolume?: number;
  isGhost?: boolean;
  riskLevel?: 'high' | 'warning' | 'none';
  overlayScores?: Record<string, number>;
}

const SHADOW_SCALE = [
  '#f3f4f6', // Lightest (Empty/Low Intention)
  '#e5e7eb',
  '#9ca3af',
  '#6b7280',
  '#374151'  // Darkest
];

const getPerformanceColor = (performanceScore: number = 0, isGhost: boolean = false, mode: 'performance' | 'shadow' = 'performance'): string => {
  // 1. Handle Shadow Mode FIRST
  if (mode === 'shadow') {
    let baseColor: string;
    if (performanceScore <= 0.05) baseColor = SHADOW_SCALE[0]; 
    else if (performanceScore < 0.2) baseColor = SHADOW_SCALE[0];
    else if (performanceScore < 0.4) baseColor = SHADOW_SCALE[1];
    else if (performanceScore < 0.6) baseColor = SHADOW_SCALE[2];
    else if (performanceScore < 0.8) baseColor = SHADOW_SCALE[3];
    else baseColor = SHADOW_SCALE[4];

    if (isGhost) return baseColor + '80';
    return baseColor;
  }

  // 2. Handle Empty Performance Standard Mode
  if (performanceScore === 0 && !isGhost) return COLORS.performanceScale[5]; 

  // 3. Handle Standard Performance Gradient
  let baseColor: string;
  if (performanceScore < 0.2) baseColor = COLORS.performanceScale[0];
  else if (performanceScore < 0.4) baseColor = COLORS.performanceScale[1];
  else if (performanceScore < 0.6) baseColor = COLORS.performanceScale[2];
  else if (performanceScore < 0.8) baseColor = COLORS.performanceScale[3];
  else baseColor = COLORS.performanceScale[4];

  if (isGhost) {
    return baseColor + '80';
  }

  return baseColor;
};

const createDataMap = (data: HeatmapDataPoint[]) => {
  const map = new Map<string, ExtendedHeatmapDataPoint>();
  data.forEach(d => {
    map.set(format(d.date, 'yyyy-MM-dd'), d as ExtendedHeatmapDataPoint);
  });
  return map;
};

interface Props {
  data: HeatmapDataPoint[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
  burnoutRiskPercent?: number;
  mode?: 'performance' | 'shadow';
}

export const MonthlyHeatmap: React.FC<Props> = ({ data, selectedDate, onSelect, mode = 'performance' }) => {
  const [isFullView, setIsFullView] = useState(false);
  
  // Memoize map for O(1) lookups
  const dataMap = useMemo(() => createDataMap(data), [data]);
  
  // Calculate max volumes for normalization
  const maxIntention = useMemo(() => Math.max(...data.map(d => ((d as ExtendedHeatmapDataPoint).intentionVolume || 0)), 1), [data]);
  const maxExecution = useMemo(() => Math.max(...data.map(d => ((d as ExtendedHeatmapDataPoint).executionVolume || 0)), 1), [data]);

  const calendarDays = useMemo(() => {
    if (isFullView) {
      // FIX: Align the start of the array with the start of the week (Sunday)
      // This ensures index 0 of the array corresponds to row 0 in the visual grid
      return eachDayOfInterval({
        start: startOfWeek(startOfYear(selectedDate)),
        end: endOfWeek(endOfYear(selectedDate))
      });
    }
    // Monthly view is standard row-major, so standard bounding works
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

      <div className="mt-4 mb-2">
        {/* FIX: Pass dataMap for O(1) lookup in Sparkline */}
        <IntegritySparkline dataMap={dataMap} selectedDate={selectedDate} />
      </div>
      
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        {isFullView ? (
          <div className="flex gap-1 min-w-max pb-4">
             {/* Year View: Column Major (Weeks are columns) */}
             {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                    // Safe index calculation
                    const dayIndex = (weekIndex * 7) + dayOfWeek;
                    
                    // Stop if we exceed generated days
                    if (dayIndex >= calendarDays.length) return <div key={dayOfWeek} className="w-[13px] h-[13px]" />;
                    
                    const date = calendarDays[dayIndex];
                    
                    // Visual Cleanup: Don't render days from previous year (if they bled into the first week)
                    // unless you want a continuous stream. Usually cleaner to dim them or hide them.
                    // Here we render them but maybe opacity could apply if stricter bounds needed.
                    
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayData = dataMap.get(dateKey);
                    
                    return (
                      <div key={dateKey} className="relative">
                        <HeatmapCell 
                          date={date}
                          data={dayData}
                          isSelected={isSameDay(date, selectedDate)}
                          onSelect={onSelect}
                          size="small"
                          mode={mode}
                          maxIntention={maxIntention}
                          maxExecution={maxExecution}
                        />
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
            {/* Month View: Row Major (Standard Calendar) */}
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
                          data={dayData}
                          isSelected={isSameDay(date, selectedDate)}
                          onSelect={onSelect}
                          size="normal"
                          mode={mode}
                          maxIntention={maxIntention}
                          maxExecution={maxExecution}
                        />
                        {dayData?.overlayScores && (
                          <div className="absolute inset-0 pointer-events-none">
                            <OverlayHeatmapCell overlayScores={dayData?.overlayScores} sizeCls="aspect-square rounded-md" />
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

      <div className="mt-auto pt-6 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
          <span>{mode === 'shadow' ? 'Shadow Intensity' : 'Performance Score'}:</span>
          <div className="flex items-center gap-1">
             {/* Dynamic Legend based on mode */}
            {mode === 'shadow' ? (
               <>
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: SHADOW_SCALE[0] }} />
                <span>Low</span>
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: SHADOW_SCALE[2] }} />
                <span>Med</span>
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: SHADOW_SCALE[4] }} />
                <span>High</span>
               </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[5] }} />
                <span>0%</span>
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[2] }} />
                <span>50%</span>
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS.performanceScale[4] }} />
                <span>100%</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Cell Component ---

interface CellProps {
  date: Date;
  data?: ExtendedHeatmapDataPoint;
  isSelected: boolean;
  onSelect: (date: Date) => void;
  size: 'normal' | 'small';
  mode: 'performance' | 'shadow';
  maxIntention: number;
  maxExecution: number;
}

const HeatmapCell: React.FC<CellProps> = ({ 
  date, data, isSelected, onSelect, size, mode, maxIntention, maxExecution 
}) => {
  const performanceScore = data?.performanceScore || 0;
  const isGhost = data?.isGhost || false;
  const integrityScore = data?.integrityScore;
  const intentionVolume = data?.intentionVolume || 0;
  const executionVolume = data?.executionVolume || 0;
  const riskLevel = data?.riskLevel;

  // Normalize values
  const intentionNorm = maxIntention > 0 ? intentionVolume / maxIntention : 0;
  const executionNorm = maxExecution > 0 ? executionVolume / maxExecution : 0;

  const sizeClasses = size === 'normal' ? 'aspect-square rounded-md' : 'w-[13px] h-[13px] rounded-[2px]';
  
  // Dynamic Risk Styles
  const riskStyles: React.CSSProperties = {};
  if (riskLevel === 'high') {
    riskStyles.borderColor = 'rgba(124,58,237,0.7)';
    riskStyles.boxShadow = '0 0 8px rgba(124,58,237,0.35)';
  } else if (riskLevel === 'warning') {
    riskStyles.borderColor = 'rgba(234,179,8,0.6)';
    riskStyles.boxShadow = '0 0 6px rgba(234,179,8,0.18)';
  }

  // Selection Styles
  const selectionStyles: React.CSSProperties = isSelected ? {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: `0 0 8px rgba(255,255,255,0.2)`
  } : {};

  // --- RENDER LOGIC ---

  // 1. Shadow Mode Render (Dual Layer)
  if (mode === 'shadow') {
    const shadowColor = getPerformanceColor(intentionNorm, false, 'shadow');
    const execColor = getPerformanceColor(executionNorm, isGhost, 'performance');
    
    return (
      <div 
        onClick={() => onSelect(date)} 
        title={`${format(date, 'MMM dd')}: Integrity: ${integrityScore !== undefined ? Math.round(integrityScore * 100) + '%' : '—'}`}
        className={`
          relative ${sizeClasses} cursor-pointer transition-all duration-200 border
          ${isSelected ? 'scale-125 z-10 border-white/30' : 'border-transparent hover:border-white/10'}
        `}
        style={{ ...riskStyles, ...selectionStyles }}
      > 
        {/* Background: Intention (Grayscale) */}
        <div className={`absolute inset-0 ${sizeClasses}`} style={{ backgroundColor: shadowColor }} />
        
        {/* Foreground: Execution (Green Overlay) - Only if there is execution */}
        {executionNorm > 0 && (
          <div 
            className={`absolute inset-0 ${sizeClasses}`} 
            style={{ 
              backgroundColor: execColor, 
              mixBlendMode: 'soft-light', 
              opacity: 0.8 
            }} 
          />
        )}
      </div>
    );
  }

  // 2. Standard Performance Render
  const bgColor = getPerformanceColor(performanceScore, isGhost, 'performance');
  
  return (
    <div
      onClick={() => onSelect(date)}
      title={`${format(date, 'MMM dd')}: ${(performanceScore * 100).toFixed(0)}%`}
      className={`
        ${sizeClasses}
        cursor-pointer transition-all duration-200 border
        ${isSelected ? 'scale-125 z-10 border-white/30' : 'border-transparent hover:border-white/10'}
        ${isGhost ? 'border-dashed' : ''}
      `}
      style={{ 
        backgroundColor: bgColor,
        ...selectionStyles,
        ...riskStyles
      }}
    />
  );
};

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

// FIX: Updated props to accept the Map directly
const IntegritySparkline: React.FC<{ dataMap: Map<string, ExtendedHeatmapDataPoint>; selectedDate: Date }> = ({ dataMap, selectedDate }) => {
  const days = eachDayOfInterval({ start: subDays(selectedDate, 29), end: selectedDate });
  
  const values = days.map((d) => {
    const key = format(d, 'yyyy-MM-dd');
    const point = dataMap.get(key);
    
    // Default logic
    if (!point) return 0;

    const iv = point.intentionVolume || 0;
    const ev = point.executionVolume || 0;
    
    // If no intention, integrity is undefined/NA, but visually 0 helps clean the graph
    if (iv === 0) return 0; 
    
    return Math.min(1, ev / iv);
  });

  const w = 240, h = 36;
  const stepX = w / Math.max(1, values.length - 1);
  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${h - v * h}`).join(' ');

  // Filter for valid data points to calculate average
  const activeValues = values.filter(v => v > 0);
  const avg = activeValues.length > 0 ? (activeValues.reduce((a,b)=>a+b,0) / activeValues.length) : 0;

  const last3 = values.slice(-3);
  const warn = last3.length === 3 && last3.every(v => v > 0 && v < 0.8);

  return (
    <div className="flex items-center gap-3">
      <svg width={w} height={h} className="rounded" viewBox={`0 0 ${w} ${h}`}>
        {/* Background track */}
        <path d={`M 0 ${h} L ${w} ${h}`} stroke="#374151" strokeWidth={1} />
        {/* Data Line */}
        <path d={path} stroke="#3b82f6" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="text-xs font-mono text-gray-400">
        Integrity (30d): <span className="text-white">{Math.round(avg * 100)}%</span>
        {warn && <span className="ml-2 text-yellow-400">• Planning Fallacy</span>}
      </div>
    </div>
  );
};