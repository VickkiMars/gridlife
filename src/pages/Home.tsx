import React, { useState, useMemo, useEffect } from "react";
import { format, isSameDay } from "date-fns";

import { usePersistentData } from "../hooks/usePersistentData";
import { usePerformanceMetrics } from "../hooks/usePerformanceMetrics";
import { useHeatmapData } from "../hooks/useHeatmapData";

import { Timeline } from "../components/visualization/Timeline";
import { MonthlyHeatmap } from "../components/visualization/MonthlyHeatmap";
import { TaskEntry } from "../components/tasks/TaskEntry";
import SquadGrid from "../components/visualization/SquadGrid";
import { DashboardHeader } from "../components/layout/DashboardHeader";
import { RecoveryBanner } from "../components/features/RecoveryBanner";

import { COLORS } from "../types/index";
import type { Task, DayEntry } from "../types/index";

// Redundant definition needed for strict typing if types/index.ts is not modified
type ExtendedTask = Omit<Task, 'created_at' | 'completed_at'> & {
  category_id?: string;
  impact_weight?: number;
  created_at?: Date | string;
  completed_at?: Date | string;
};

const RECOVERY_THRESHOLD = 5;

const Home: React.FC = () => {
  // --- Data & State ---
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { entries: rawEntries, setEntries, exportData, importData, squads } = usePersistentData() as any;
  const entries = (rawEntries || []) as DayEntry[];

  // Visual State
  const [overlayMode, setOverlayMode] = useState(false);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'volume' | 'integrity'>('volume');
  const shadowMode = viewMode === 'integrity'; // Derived for backward compatibility with Heatmap
  
  // Recovery State
  const [showRecoveryQuest, setShowRecoveryQuest] = useState(false);
  const [brokenStreakDate, setBrokenStreakDate] = useState<Date | null>(null);

  // --- Logic Hooks ---
  const { currentStreak, recoveryGracePeriod, burnoutMetrics } = usePerformanceMetrics(entries);
  
  const heatmapData = useHeatmapData({
    entries,
    activeCategories,
    overlayMode,
    shadowMode,
    burnoutMetrics
  });

  // --- Effects ---
  useEffect(() => {
    if (recoveryGracePeriod) {
      setBrokenStreakDate(recoveryGracePeriod.brokenDate);
      setShowRecoveryQuest(true);
    } else {
      setShowRecoveryQuest(false);
      setBrokenStreakDate(null);
    }
  }, [recoveryGracePeriod]);

  // --- Derived Lists ---
  const activeTasks = useMemo(
    () => entries.find((e) => isSameDay(e.date, selectedDate))?.tasks || [],
    [entries, selectedDate]
  );

  const categories = useMemo<string[]>(() => {
    return Array.from(
      new Set(entries.flatMap((e) => e.tasks.map((t) => (t as ExtendedTask).category_id || 'General')))
    );
  }, [entries]);

  const timelineStatus = useMemo(() => entries.map((entry) => ({
      date: entry.date,
      hasData: entry.tasks.length > 0,
      isAllDone: entry.tasks.length > 0 && entry.tasks.every((t) => t.completed)
    })), [entries]);

  const totalTasks = entries.reduce((acc, curr) => acc + curr.tasks.length, 0);
  const completedTasks = entries.reduce((acc, curr) => acc + curr.tasks.filter((t) => t.completed).length, 0);

  // --- Handlers ---

  const handleToggle = (taskId: string) => {
    setEntries((prev: DayEntry[]) => {
      const updatedEntries = prev.map((entry) => {
        if (!isSameDay(entry.date, selectedDate)) return entry;
        
        const updatedTasks = entry.tasks.map((t) =>
          t.id === taskId 
            ? { ...t, completed: !t.completed, completed_at: !t.completed ? new Date() : undefined } 
            : t
        );
        return { ...entry, tasks: updatedTasks };
      });
      
      const currentEntry = updatedEntries.find(e => isSameDay(e.date, selectedDate));
      const targetTask = currentEntry?.tasks.find(t => t.id === taskId);
      
      // Recovery Check
      if (
          targetTask?.completed && 
          ((targetTask as ExtendedTask).impact_weight || 0) >= RECOVERY_THRESHOLD && 
          showRecoveryQuest && 
          brokenStreakDate
      ) {
          return updatedEntries.map(e => {
              if (isSameDay(e.date, brokenStreakDate)) {
                  return { ...e, status: 'recovered' as const, recoveryAttemptedAt: new Date() };
              }
              return e;
          });
      }

      return updatedEntries;
    });
  };

  const handleAddTask = (newTask: Task) => {
    setEntries((prev: DayEntry[]) => {
      const taskToInsert = { ...newTask, date: selectedDate, created_at: new Date() } as ExtendedTask;
      const exists = prev.find((e) => isSameDay(e.date, selectedDate));
      if (exists) {
        return prev.map((e) => isSameDay(e.date, selectedDate) ? { ...e, tasks: [...e.tasks, taskToInsert] } : e);
      }
      return [...prev, { date: selectedDate, tasks: [taskToInsert], status: 'active', id: crypto.randomUUID() }];
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setEntries((prev: DayEntry[]) => prev.map((entry) => {
        if (!isSameDay(entry.date, selectedDate)) return entry;
        return { ...entry, tasks: entry.tasks.filter((t) => t.id !== taskId) };
      })
    );
  };

  // --- Render ---

  return (
    <div className="min-h-screen p-6 font-sans text-gray-100" style={{ backgroundColor: COLORS.background }}>
      
      <DashboardHeader 
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        currentStreak={currentStreak}
        categories={categories}
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
        onImport={importData}
        onExport={exportData}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        
        {showRecoveryQuest && brokenStreakDate && (
          <RecoveryBanner 
            brokenStreakDate={brokenStreakDate}
            hoursRemaining={Math.max(0, Math.ceil(48 - (recoveryGracePeriod?.hoursSinceBreak || 0)))}
            recoveryThreshold={RECOVERY_THRESHOLD}
            onDismiss={() => setShowRecoveryQuest(false)}
          />
        )}
        
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
          <Timeline datesStatus={timelineStatus} selectedDate={selectedDate} onSelect={setSelectedDate} />
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-bold tracking-tight text-white">{format(selectedDate, "EEEE")}</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">{format(selectedDate, "MMMM dd, yyyy")}</p>
              {isSameDay(selectedDate, new Date()) && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">TODAY</span>}
            </div>
          </div>
          <TaskEntry
            tasks={activeTasks}
            onToggle={handleToggle}
            onAddTask={handleAddTask}
            onDelete={handleDeleteTask}
            burnoutRiskPercent={burnoutMetrics.riskPercent}
          />
        </div>

        <div className="col-span-12 lg:col-span-3 h-full">
          <MonthlyHeatmap
            data={heatmapData}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            burnoutRiskPercent={burnoutMetrics.riskPercent}
            mode={shadowMode ? 'shadow' : 'performance'}
          />
          {squads && squads.length > 0 && (
            <div className="mt-4">
              <SquadGrid squad={squads[0]} entries={entries} selectedDate={selectedDate} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;