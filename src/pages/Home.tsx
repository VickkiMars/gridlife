import React, { useState, useMemo } from "react";
import { subDays, eachDayOfInterval, format, isSameDay } from "date-fns";
import { Upload, Download, Activity } from "lucide-react";

import { usePersistentData } from "../hooks/usePersistentData";
import { Timeline } from "../components/visualization/Timeline";
import { MonthlyHeatmap } from "../components/visualization/MonthlyHeatmap";
import { TaskEntry } from "../components/tasks/TaskEntry";
import { COLORS } from "../types/index.ts";
import type { Task } from "../types/index.ts";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { entries, setEntries, exportData, importData } = usePersistentData();

  // 35 days for timeline/heatmap (5 weeks)
  const dateRange = useMemo(
    () =>
      eachDayOfInterval({
        start: subDays(new Date(), 34),
        end: new Date(),
      }).reverse(),
    []
  );

  // Filter tasks for selected date
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

  // Handles the checkbox toggle logic
  const handleToggle = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (isSameDay(entry.date, selectedDate)) {
          return {
            ...entry,
            tasks: entry.tasks.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return entry;
      })
    );
  };

  // Handles adding a new task (receives full Task object from TaskEntry)
  const handleAddTask = (newTask: Task) => {
    setEntries((prev) => {
      // Check if an entry for the selected date already exists
      const exists = prev.find((e) => isSameDay(e.date, selectedDate));

      if (exists) {
        return prev.map((e) =>
          isSameDay(e.date, selectedDate)
            ? { ...e, tasks: [...e.tasks, newTask] }
            : e
        );
      }

      // If no entry exists for this date, create a new entry with this task
      return [...prev, { date: selectedDate, tasks: [newTask] }];
    });
  };

  return (
    <div
      className="min-h-screen p-6 font-sans text-gray-100"
      style={{ backgroundColor: COLORS.background }}
    >
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
            <h1 className="text-xl font-bold tracking-tight">Kinetics.io</h1>
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

          {/* Actions */}
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

      <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
        {/* Left: Scrollable Timeline */}
        <div className="col-span-12 lg:col-span-3">
          <Timeline
            dates={dateRange}
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
          />
        </div>

        {/* Right: Large Heatmap */}
        <div className="col-span-12 lg:col-span-3">
          <MonthlyHeatmap
            data={dateRange.map((d) => ({
              date: d,
              intensity:
                entries.find((e) => isSameDay(e.date, d))?.tasks.length || 0,
            }))}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;