import { useMemo } from "react";
import { format, isSameDay, differenceInHours, subDays, startOfDay } from "date-fns";
import type { Task, DayEntry } from "../types/index";

// Local type definition to handle loose date types
type ExtendedTask = Omit<Task, 'created_at' | 'completed_at'> & {
  category_id?: string;
  impact_weight?: number;
  created_at?: Date | string;
  completed_at?: Date | string;
};

const MAX_HISTORY_DAYS = 365;

export const usePerformanceMetrics = (entries: DayEntry[]) => {
  
  const getWeight = (t: ExtendedTask) => t.impact_weight || 0;

  // --- 1. Streak Logic ---
  const currentStreak = useMemo(() => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = startOfDay(new Date());

    for (const entry of sortedEntries) {
      const entryDate = startOfDay(new Date(entry.date));
      if (entryDate.getTime() > today.getTime()) continue;

      const dailySum = entry.tasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + getWeight(t as ExtendedTask), 0);
      
      const isRecovered = entry.status === 'recovered';
      
      if (dailySum > 0 || isRecovered) {
        streak++;
      } else {
        if (!isSameDay(entryDate, today)) break; 
      }
    }
    return streak;
  }, [entries]);

  // --- 2. Recovery Detection ---
  const recoveryGracePeriod = useMemo(() => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date();

    for (const entry of sortedEntries) {
      if (entry.status === 'recovered') continue;
      
      const dailySum = entry.tasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + getWeight(t as ExtendedTask), 0);

      if (dailySum === 0) {
        const hoursSinceBroken = differenceInHours(today, new Date(entry.date));
        if (hoursSinceBroken > 0 && hoursSinceBroken < 48) {
          return {
            brokenDate: new Date(entry.date),
            hoursSinceBreak: hoursSinceBroken,
            isRecoverable: true
          };
        }
      }
      if (dailySum > 0) break;
    }
    return null;
  }, [entries]);

  // --- 3. Burnout Metrics ---
  const maxDailyScore = useMemo(() => {
     let max = 1;
     entries.forEach((e) => {
       const sum = e.tasks.filter((t) => t.completed).reduce((acc, t) => acc + getWeight(t as ExtendedTask), 0);
       if (sum > max) max = sum;
     });
     return max;
  }, [entries]);

  const burnoutMetrics = useMemo(() => {
    const weightMap = new Map<string, number>();
    const weights: number[] = [];

    entries.forEach((entry) => {
      const w = entry.tasks.filter((t) => t.completed).reduce((s, t) => s + getWeight(t as ExtendedTask), 0);
      const key = format(new Date(entry.date), 'yyyy-MM-dd');
      weightMap.set(key, w);
      weights.push(w);
    });

    const sortedWeights = [...weights].sort((a, b) => a - b);
    const p90 = sortedWeights.length ? sortedWeights[Math.floor(0.9 * (sortedWeights.length - 1))] : 0;

    const now = new Date();
    let consecutive = 0;
    for (let i = 0; i < MAX_HISTORY_DAYS; i++) {
      const day = subDays(now, i);
      const key = format(day, 'yyyy-MM-dd');
      const w = weightMap.get(key) || 0;
      if (w > p90) consecutive++;
      else break; 
    }

    let sum = 0;
    let count = 0;
    const last30Values: number[] = [];
    
    for (let i = 0; i < 30; i++) {
      const day = subDays(now, i);
      const key = format(day, 'yyyy-MM-dd');
      if (weightMap.has(key)) {
         const val = weightMap.get(key) || 0;
         last30Values.push(val);
         sum += val;
         count++;
      }
    }

    const mean30 = count > 0 ? sum / count : 0;
    const variance30 = count > 0 
      ? last30Values.reduce((acc, val) => acc + Math.pow(val - mean30, 2), 0) / count 
      : 0;

    let riskPercent = Math.min(100, Math.round((consecutive / 10) * 100));
    const highVolume = mean30 >= 0.7 * maxDailyScore; 
    const lowVariance = variance30 < (maxDailyScore * 0.1); 

    if (lowVariance && highVolume) riskPercent = Math.max(riskPercent, 80);
    if (consecutive >= 7) riskPercent = 100;

    const highDays = new Set<string>();
    weightMap.forEach((val, key) => {
      if (val > p90) highDays.add(key);
    });

    return { riskPercent, highDays };
  }, [entries, maxDailyScore]);

  return { currentStreak, recoveryGracePeriod, burnoutMetrics, maxDailyScore };
};