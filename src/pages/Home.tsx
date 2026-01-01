import React, { useState, useMemo } from "react";
import { format, isSameDay, differenceInHours, subDays } from "date-fns";
import { Upload, Download, Activity, Zap } from "lucide-react";

import { usePersistentData } from "../hooks/usePersistentData";
import { Timeline } from "../components/visualization/Timeline";
import { MonthlyHeatmap } from "../components/visualization/MonthlyHeatmap";
import { TaskEntry } from "../components/tasks/TaskEntry";
import { COLORS } from "../types/index";
import type { Task, DayEntry, HeatmapDataPoint } from "../types/index";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { entries, setEntries, exportData, importData } = usePersistentData();
  const [showRecoveryQuest, setShowRecoveryQuest] = useState(false);
  const [brokenStreakDate, setBrokenStreakDate] = useState<Date | null>(null);
  const [overlayMode, setOverlayMode] = useState(false);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // 0. Calculate Daily Performance Scores (last 30 days)
  // Sum completed task weights for each day, then find the max
  const dailyPerformanceScores = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const scores = new Map<string, number>();
    entries.forEach((entry) => {
      if (entry.date >= thirtyDaysAgo) {
        const dailySum = entry.tasks
          .filter((t) => t.completed)
          .reduce((sum, t) => sum + (t.weight || 0), 0);
        scores.set(format(entry.date, 'yyyy-MM-dd'), dailySum);
      }
    });

    return scores;
  }, [entries]);

  // Find max daily score for normalization
  const maxDailyScore = useMemo(() => {
    return Math.max(...Array.from(dailyPerformanceScores.values()), 1); // Min 1 to avoid division by zero
  }, [dailyPerformanceScores]);

  // STREAK CALCULATION: Count consecutive days with performance > 0 (includes recovered days)
  const currentStreak = useMemo(() => {
    const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      // Calculate if day has performance (active or recovered)
      const dailySum = entry.tasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + (t.weight || 0), 0);
      const isRecovered = entry.status === 'recovered';
      
      if (dailySum > 0 || isRecovered) {
        streak++;
      } else {
        // Streak broken - stop counting
        break;
      }

      // Stop if we go too far back
      if (today.getTime() - entryDate.getTime() > 365 * 24 * 60 * 60 * 1000) break;
    }

    return streak;
  }, [entries]);

  // RECOVERY DETECTION: Check if latest day is broken and in recovery grace period
  const recoveryGracePeriod = useMemo(() => {
    const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      // Skip if already recovered
      if (entry.status === 'recovered') continue;
      
      const dailySum = entry.tasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + (t.weight || 0), 0);

      // Found a zero-sum day
      if (dailySum === 0) {
        const hoursSinceBroken = differenceInHours(today, entryDate);
        if (hoursSinceBroken < 48) {
          return {
            brokenDate: entryDate,
            hoursSinceBreak: hoursSinceBroken,
            isRecoverable: true
          };
        }
      }
      
      break; // Only check the most recent zero-sum day
    }

    return null;
  }, [entries]);

  // Show recovery quest if streak is broken
  React.useEffect(() => {
    if (recoveryGracePeriod) {
      setShowRecoveryQuest(true);
      setBrokenStreakDate(recoveryGracePeriod.brokenDate);
    }
  }, [recoveryGracePeriod]);

  // BURNOUT PREDICTION: Rolling statistics, percentiles, variance
  const burnoutMetrics = useMemo(() => {
    // Build map of dateKey -> total completed weight W
    const allWeights: Array<{ key: string; date: Date; w: number }> = entries.map((entry) => {
      const w = entry.tasks.filter((t) => t.completed).reduce((s, t) => s + (t.weight || 0), 0);
      return { key: format(entry.date, 'yyyy-MM-dd'), date: entry.date, w };
    });

    // Consider last 90 days for percentile calculation (or all if fewer)
    const now = new Date();
    const cutoff = subDays(now, 90);
    const recent = allWeights.filter((d) => d.date >= cutoff).map((d) => d.w);
    const values = recent.length ? recent.slice().sort((a, b) => a - b) : [0];
    const idx90 = Math.max(0, Math.floor(0.9 * (values.length - 1)));
    const p90 = values[idx90] ?? (values[values.length - 1] ?? 0);

    // Count consecutive recent days where W > p90
    let consecutive = 0;
    // iterate backwards from today for consecutive calendar days
    for (let i = 0; i < 365; i++) {
      const day = subDays(now, i);
      const key = format(day, 'yyyy-MM-dd');
      const found = allWeights.find((d) => d.key === key);
      const w = found ? found.w : 0;
      if (w > p90) consecutive++; else break;
    }

    // Rolling 30-day variance and mean
    const last30cut = subDays(now, 30);
    const last30 = allWeights.filter((d) => d.date >= last30cut).map((d) => d.w);
    const mean30 = last30.length ? last30.reduce((a, b) => a + b, 0) / last30.length : 0;
    const variance30 = last30.length ? last30.reduce((a, b) => a + Math.pow(b - mean30, 2), 0) / last30.length : 0;

    // Determine risk percent: base on consecutive days, boosted by low variance + high mean
    let riskPercent = Math.min(100, Math.round((consecutive / 10) * 100));
    const highVolume = mean30 >= 0.9 * maxDailyScore;
    const lowVariance = variance30 < 1; // heuristic threshold
    if (lowVariance && highVolume) riskPercent = Math.max(riskPercent, 80);
    if (consecutive >= 10) riskPercent = 100;

    // Mark days above p90
    const highDays = new Set(allWeights.filter((d) => d.w > p90).map((d) => d.key));

    return { p90, consecutive, mean30, variance30, riskPercent, highDays };
  }, [entries, maxDailyScore]);

  const burnoutRiskPercent = burnoutMetrics.riskPercent;

  const heatmapData = useMemo<HeatmapDataPoint[]>(() => {
    const categoriesToConsider = activeCategories && activeCategories.length > 0 ? activeCategories : [];

    return entries.map((entry) => {
      const isGhost = entry.status === 'recovered';
      const dateKey = format(entry.date, 'yyyy-MM-dd');

      // Helper to calculate risk level safely
      const getRiskLevel = () => 
        burnoutMetrics.highDays.has(dateKey) 
          ? (burnoutMetrics.riskPercent >= 80 ? 'high' as const : 'warning' as const) 
          : 'none' as const;

      // Overlay mode: compute per-category normalized scores
      if (overlayMode && categoriesToConsider.length > 0) {
        const overlayScores: Record<string, number> = {};
        categoriesToConsider.forEach((cat) => {
          const catSum = entry.tasks
            .filter((t) => t.completed && ((t as any).category_id || 'General') === cat)
            .reduce((sum, t) => sum + (t.weight || 0), 0);
          overlayScores[cat] = catSum / maxDailyScore;
        });

        // For a base performance number, use the max across selected categories
        const performanceScore = Math.max(...Object.values(overlayScores), 0);

        return {
          date: entry.date,
          intensity: entry.tasks.length,
          performanceScore: isGhost ? 1 : performanceScore,
          isAllDone: entry.tasks.length > 0 && entry.tasks.every(t => t.completed),
          status: entry.status,
          isGhost: isGhost,
          overlayScores,
          riskLevel: getRiskLevel()
        };
      }

      // Single-category filter
      if (categoriesToConsider.length === 1) {
        const cat = categoriesToConsider[0];
        const dailySum = entry.tasks
          .filter((t) => t.completed && ((t as any).category_id || 'General') === cat)
          .reduce((sum, t) => sum + (t.weight || 0), 0);
        const performanceScore = dailySum / maxDailyScore;

        return {
          date: entry.date,
          intensity: entry.tasks.length,
          performanceScore: isGhost ? 1 : performanceScore,
          isAllDone: entry.tasks.length > 0 && entry.tasks.every(t => t.completed),
          status: entry.status,
          isGhost: isGhost,
          riskLevel: getRiskLevel()
        };
      }

      // Default: all categories
      const dailySum = entry.tasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + (t.weight || 0), 0);
      const performanceScore = dailySum / maxDailyScore;

      return {
        date: entry.date,
        intensity: entry.tasks.length,
        performanceScore: isGhost ? 1 : performanceScore, // Ghosts show as full intensity
        isAllDone: entry.tasks.length > 0 && entry.tasks.every(t => t.completed),
        status: entry.status,
        isGhost: isGhost,
        riskLevel: getRiskLevel()
      };
    });
  }, [entries, maxDailyScore, burnoutMetrics, activeCategories, overlayMode]);

  // 2. Prepare Data for Timeline
  // Passes specific status flags so the timeline can color the dots (Amber/Blue/Grey)
  const timelineStatus = useMemo(() => {
    return entries.map((entry) => {
      const taskCount = entry.tasks.length;
      return {
        date: entry.date,
        hasData: taskCount > 0,
        isAllDone: taskCount > 0 && entry.tasks.every(t => t.completed)
      };
    });
  }, [entries]);

  // 3. Get Tasks for the current selection
  const activeTasks = useMemo(
    () => entries.find((e) => isSameDay(e.date, selectedDate))?.tasks || [],
    [entries, selectedDate]
  );

  // Derived stats
  const totalTasks = entries.reduce((acc, curr) => acc + curr.tasks.length, 0);
  const completedTasks = entries.reduce(
    (acc, curr) => acc + curr.tasks.filter((t) => t.completed).length,
    0
  );

  const categories = useMemo(() => {
    return Array.from(
      new Set(entries.flatMap((e) => e.tasks.map((t) => (t as any).category_id || 'General')))
    );
  }, [entries]);

  // --- HANDLERS ---

  const handleToggle = (taskId: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (!isSameDay(entry.date, selectedDate)) return entry;
        
        const updatedTasks = entry.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );

        // CHECK FOR RECOVERY: If completing a task with weight >= 8 and recovery is active
        const completedTask = updatedTasks.find((t) => t.id === taskId && t.completed);
        if (
          completedTask &&
          completedTask.weight >= 8 &&
          recoveryGracePeriod &&
          showRecoveryQuest &&
          brokenStreakDate
        ) {
          // Mark the broken day as recovered
          const updatedEntries = prev.map((e) => {
            if (isSameDay(e.date, brokenStreakDate)) {
              return {
                ...e,
                status: 'recovered' as const,
                recoveryAttemptedAt: new Date()
              };
            }
            return e;
          });

          // Also update current entry
          updatedEntries.forEach((e) => {
            if (isSameDay(e.date, selectedDate)) {
              e.tasks = updatedTasks;
            }
          });

          setShowRecoveryQuest(false);
          setBrokenStreakDate(null);
          setEntries(updatedEntries);
          return updatedEntries.find((e) => isSameDay(e.date, selectedDate)) || entry;
        }

        return { ...entry, tasks: updatedTasks };
      })
    );
  };

  const handleAddTask = (newTask: Task) => {
    setEntries((prev) => {
      const exists = prev.find((e) => isSameDay(e.date, selectedDate));
      if (exists) {
        return prev.map((e) =>
          isSameDay(e.date, selectedDate)
            ? { ...e, tasks: [...e.tasks, newTask] }
            : e
        );
      }
      return [...prev, { date: selectedDate, tasks: [newTask] }];
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setEntries((prev) => 
      prev.map((entry) => {
        // Find the day entry
        if (!isSameDay(entry.date, selectedDate)) return entry;
        
        // Filter out the specific task
        const updatedTasks = entry.tasks.filter((t) => t.id !== taskId);
        
        // Return updated entry
        return { ...entry, tasks: updatedTasks };
      })
    );
  };

  return (
    <div
      className="min-h-screen p-6 font-sans text-gray-100"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* HEADER */}
      <header className="max-w-[1600px] mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, #6366f1)`,
            }}
          >
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Gridlife.io</h1>
            <p className="text-xs text-gray-500 font-mono">
              Productivity Visualization Engine
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Stats Badge */}
          <div
            className="hidden md:flex items-center gap-4 px-4 py-2 rounded-lg border mr-4"
            style={{
              borderColor: COLORS.border,
              backgroundColor: COLORS.surface,
            }}
          >
            <div className="text-xs text-gray-400">
              Total: <span className="text-white font-mono">{totalTasks}</span>
            </div>
            <div className="text-xs text-gray-400">
              Done:{" "}
              <span className="text-green-400 font-mono">{completedTasks}</span>
            </div>
          </div>

          {/* Layer Selector (desktop) */}
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg border mr-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <label className="text-xs font-mono text-gray-400 mr-2">Layer:</label>
            <select
              multiple={overlayMode}
              value={overlayMode ? activeCategories : (activeCategories.length === 1 ? activeCategories[0] : '')}
              onChange={(e) => {
                if (overlayMode) {
                  const opts = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value);
                  setActiveCategories(opts);
                } else {
                  const v = (e.target as HTMLSelectElement).value;
                  setActiveCategories(v ? [v] : []);
                }
              }}
              className="bg-transparent text-sm text-gray-200 px-2 py-1 rounded border border-transparent outline-none max-w-[160px]"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-xs text-gray-400 ml-3">
              <input type="checkbox" checked={overlayMode} onChange={(e) => { const checked = e.target.checked; setOverlayMode(checked); if (!checked) setActiveCategories([]); }} />
              <span className="font-mono">Overlay</span>
            </label>
          </div>

          {/* Layer Selector (mobile) - compact, shows single-select and overlay toggle */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={activeCategories.length === 1 ? activeCategories[0] : ''}
              onChange={(e) => {
                const v = e.target.value;
                setActiveCategories(v ? [v] : []);
                setOverlayMode(false);
              }}
              className="bg-[#27272a] text-sm text-gray-200 px-2 py-1 rounded border border-[#3f3f46]"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => setOverlayMode((s) => { if (s) setActiveCategories([]); return !s; })}
              className={`px-2 py-1 rounded text-xs font-mono ${overlayMode ? 'bg-[#3b82f6] text-white' : 'bg-transparent text-gray-400 border border-[#3f3f46]'}`}
            >
              Overlay
            </button>
          </div>

          {/* Import/Export */}
          <label
            className="p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors"
            style={{ borderColor: COLORS.border }}
          >
            <Upload size={18} className="text-gray-400" />
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && importData(e.target.files[0])
              }
            />
          </label>

          <button
            onClick={exportData}
            className="p-2 rounded-lg border hover:bg-white/5 transition-colors"
            style={{ borderColor: COLORS.border }}
          >
            <Download size={18} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* GRID LAYOUT */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        
        {/* Recovery Quest Modal */}
        {showRecoveryQuest && recoveryGracePeriod && (
          <div className="col-span-12 animate-in fade-in duration-300">
            <div className="border-2 border-yellow-500/50 rounded-lg p-4 bg-yellow-500/5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">🔥 Recovery Quest</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Your streak was broken on <strong>{format(brokenStreakDate || new Date(), 'MMM dd')}</strong>. 
                    Complete a task with <strong>Impact Weight ≥ 8</strong> within the next <strong>{Math.ceil(48 - (recoveryGracePeriod.hoursSinceBreak || 0))} hours</strong> to recover your streak!
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowRecoveryQuest(false)}
                      className="px-3 py-1 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded border border-yellow-500/30 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Left: Timeline (15-day sliding window) */}
        <div className="col-span-12 lg:col-span-3">
          <Timeline
            datesStatus={timelineStatus} // Passes rich status (Done/Pending/Empty)
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        {/* Center: Interactive Task Entry */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {format(selectedDate, "EEEE")}
            </h2>
            <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
              {format(selectedDate, "MMMM dd, yyyy")}
            </p>
          </div>
          <TaskEntry
            tasks={activeTasks}
            onToggle={handleToggle}
            onAddTask={handleAddTask}
            onDelete={handleDeleteTask}
            burnoutRiskPercent={burnoutRiskPercent}
          />
        </div>

        {/* Right: Heatmap (Monthly/Yearly) */}
        <div className="col-span-12 lg:col-span-3">
          <MonthlyHeatmap
            data={heatmapData} // Now includes isAllDone for color coding
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            burnoutRiskPercent={burnoutRiskPercent}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;