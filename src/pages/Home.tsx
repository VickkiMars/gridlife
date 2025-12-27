import React, { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Upload, Download, Activity } from "lucide-react";

import { usePersistentData } from "../hooks/usePersistentData";
import { Timeline } from "../components/visualization/Timeline";
import { MonthlyHeatmap } from "../components/visualization/MonthlyHeatmap";
import { TaskEntry } from "../components/tasks/TaskEntry";
import { COLORS } from "../types/index";
import type { Task } from "../types/index";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { entries, setEntries, exportData, importData } = usePersistentData();

  // 1. Prepare Data for Heatmap
  // Calculates intensity and whether the day is fully "conquered" (Blue) or pending (Amber)
  const heatmapData = useMemo(() => {
    return entries.map((entry) => {
      const taskCount = entry.tasks.length;
      // It is "All Done" if there are tasks AND every single one is completed.
      const isAllDone = taskCount > 0 && entry.tasks.every(t => t.completed);
      
      return {
        date: entry.date,
        intensity: taskCount,
        isAllDone: isAllDone
      };
    });
  }, [entries]);

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

  // --- HANDLERS ---

  const handleToggle = (taskId: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (!isSameDay(entry.date, selectedDate)) return entry;
        return {
          ...entry,
          tasks: entry.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        };
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
          />
        </div>

        {/* Right: Heatmap (Monthly/Yearly) */}
        <div className="col-span-12 lg:col-span-3">
          <MonthlyHeatmap
            data={heatmapData} // Now includes isAllDone for color coding
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;