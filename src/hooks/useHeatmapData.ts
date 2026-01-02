import { useMemo } from "react";
import { format } from "date-fns";
import type { Task, DayEntry, HeatmapDataPoint } from "../types/index";

type ExtendedTask = Omit<Task, 'created_at' | 'completed_at'> & {
  category_id?: string;
  impact_weight?: number;
  created_at?: Date | string;
  completed_at?: Date | string;
};

interface UseHeatmapDataProps {
  entries: DayEntry[];
  activeCategories: string[];
  overlayMode: boolean;
  shadowMode: boolean;
  burnoutMetrics: { riskPercent: number; highDays: Set<string> };
}

export const useHeatmapData = ({ 
  entries, 
  activeCategories, 
  overlayMode, 
  shadowMode, 
  burnoutMetrics 
}: UseHeatmapDataProps) => {
  
  const getWeight = (t: ExtendedTask) => t.impact_weight || 0;

  return useMemo<HeatmapDataPoint[]>(() => {
    const categoriesToConsider = activeCategories.length > 0 ? activeCategories : [];
    
    const allTasks = entries.flatMap((e) => e.tasks.map((t) => ({ 
      ...t, 
      date: e.date 
    } as ExtendedTask)));

    const relevantTasks = categoriesToConsider.length > 0 
      ? allTasks.filter(t => categoriesToConsider.includes(t.category_id || 'General'))
      : allTasks;

    const ivMap = new Map<string, number>();
    const evMap = new Map<string, number>();

    relevantTasks.forEach(t => {
      const dateKey = format(new Date(t.date as Date | string), 'yyyy-MM-dd'); 
      const w = getWeight(t);
      ivMap.set(dateKey, (ivMap.get(dateKey) || 0) + w);
      if (t.completed) {
        evMap.set(dateKey, (evMap.get(dateKey) || 0) + w);
      }
    });

    const maxEV = Math.max(...Array.from(evMap.values()), 1);

    return entries.map((entry) => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      const isGhost = entry.status === 'recovered';
      
      const iv = ivMap.get(dateKey) || 0;
      const ev = evMap.get(dateKey) || 0;
      
      const integrity = iv > 0 ? Math.min(1, ev / iv) : (ev > 0 ? 1 : undefined);
      const performanceScore = ev / maxEV;

      const riskLevel = burnoutMetrics.highDays.has(dateKey)
          ? (burnoutMetrics.riskPercent >= 80 ? 'high' : 'warning')
          : 'none';

      let overlayScores: Record<string, number> | undefined = undefined;
      
      if (overlayMode && categoriesToConsider.length > 0) {
        overlayScores = {};
        categoriesToConsider.forEach(cat => {
           const catSum = entry.tasks
             .filter(t => t.completed && ((t as ExtendedTask).category_id || 'General') === cat)
             .reduce((sum, t) => sum + getWeight(t as ExtendedTask), 0);
           overlayScores![cat] = catSum / maxEV;
        });
      }

      return {
        date: new Date(entry.date),
        intensity: entry.tasks.length,
        performanceScore: isGhost ? 1 : performanceScore,
        intentionVolume: iv,
        executionVolume: ev,
        integrityScore: integrity,
        isAllDone: entry.tasks.length > 0 && entry.tasks.every(t => t.completed),
        status: entry.status,
        isGhost,
        overlayScores,
        riskLevel
      };
    });
  }, [entries, activeCategories, overlayMode, burnoutMetrics, shadowMode]);
};