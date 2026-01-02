import { useMemo } from 'react';
import { 
  isWithinInterval, eachDayOfInterval, isSameDay, getDay 
} from 'date-fns';
import type { DayEntry } from '../types';

interface DateRange {
  start: Date;
  end: Date;
}

interface AnalyticsResult {
  totalTasks: number;
  completedTasks: number;
  consistencyScore: number; // 0-100%
  topCategory: string;
  categoryDistribution: { name: string; value: number; color: string }[];
  longestStreak: number;
  busiestDay: string; // e.g., "Tuesday"
  leastBusyDay: string;
  percentile: number; // Mocked for now (Frontend only)
  heatmapData: { date: Date; intensity: number }[];
}

const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'
];

export const useAnalytics = (entries: DayEntry[], range: DateRange): AnalyticsResult => {
  return useMemo(() => {
    // 1. Filter Entries by Range
    const rangeEntries = entries.filter(e => 
      isWithinInterval(new Date(e.date), range)
    );

    const rangeTasks = rangeEntries.flatMap(e => e.tasks);
    const completedRangeTasks = rangeTasks.filter(t => t.completed);

    // 2. Total & Completed
    const totalTasks = rangeTasks.length;
    const completedTasks = completedRangeTasks.length;

    // 3. Consistency Score (Execution / Intention)
    const consistencyScore = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // 4. Category Logic
    const catMap = new Map<string, number>();
    completedRangeTasks.forEach(t => {
      // Handle loose typing if necessary
      const cat = (t as any).category_id || (t as any).tag || 'General';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });

    const sortedCats = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0]?.[0] || 'None';

    const categoryDistribution = sortedCats.map((c, i) => ({
      name: c[0],
      value: c[1],
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length]
    })).slice(0, 5); // Top 5

    // 5. Longest Streak (within this range)
    let longestStreak = 0; // FIX: Renamed from maxStreak to match return type
    let currentStreak = 0;
    
    // Sort ascending for streak calc
    const sortedByDate = [...rangeEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedByDate.forEach(e => {
      const hasActivity = e.tasks.some(t => t.completed);
      if (hasActivity || e.status === 'recovered') {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    // 6. Busiest / Least Busy Day of Week
    const dayCounts = [0,0,0,0,0,0,0]; // Sun-Sat
    rangeEntries.forEach(e => {
      const completedCount = e.tasks.filter(t => t.completed).length;
      if (completedCount > 0) {
        const dayIndex = getDay(new Date(e.date));
        dayCounts[dayIndex] += completedCount;
      }
    });
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxVal = Math.max(...dayCounts);
    // Filter c > 0 so we don't just pick a day with 0 tasks as "least busy" if user actually worked other days
    const activeDayCounts = dayCounts.filter(c => c > 0);
    const minVal = activeDayCounts.length > 0 ? Math.min(...activeDayCounts) : 0;
    
    const busiestDay = daysOfWeek[dayCounts.indexOf(maxVal)] || 'N/A';
    
    // Find index of minVal, ensuring we handle the case where multiple days might be 0/min
    // If no work done at all, default to N/A
    let leastBusyDay = 'N/A';
    if (activeDayCounts.length > 0) {
       const minIndex = dayCounts.indexOf(minVal);
       leastBusyDay = daysOfWeek[minIndex];
    }

    // 7. Mock Percentile
    const mockPercentile = Math.min(99, Math.round(50 + (consistencyScore * 0.4) + (longestStreak > 7 ? 5 : 0)));

    // 8. Heatmap Data
    const heatmapData = eachDayOfInterval(range).map(date => {
        const entry = entries.find(e => isSameDay(new Date(e.date), date));
        const count = entry?.tasks.filter(t => t.completed).length || 0;
        return { date, intensity: count };
    });

    return {
      totalTasks,
      completedTasks,
      consistencyScore,
      topCategory,
      categoryDistribution,
      longestStreak, // FIX: Now matches variable name
      busiestDay,
      leastBusyDay,
      percentile: mockPercentile,
      heatmapData
    };
  }, [entries, range]);
};