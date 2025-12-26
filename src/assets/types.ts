export const COLORS = {
  primary: "#3b82f6",     // Electric Blue accent
  background: "#0a0a0c",  // Deep Obsidian background
  surface: "#161618",     // Panel/Card surface
  border: "#27272a",      // Subdued borders
  
  // Heatmap Spectral Scale (0 = Empty, 4 = Peak)
  levels: {
    0: '#1A1A1A',         // Neutral Dark
    1: 'rgba(59, 130, 246, 0.25)', // 25% Blue
    2: 'rgba(59, 130, 246, 0.50)', // 50% Blue
    3: 'rgba(59, 130, 246, 0.75)', // 75% Blue
    4: '#3b82f6',         // 100% Blue (Solid)
  }
} as const;

/**
 * Task Management Types
 */
export type TaskTag = 'DEV' | 'MTG' | 'ANA' | 'OPS' | 'WRK' | string;

export type Task = {
  id: string;
  title: string;
  tag: TaskTag;      // Defaults to 'WRK' if unspecified
  completed: boolean;
  createdAt: Date;
};

export type DayEntry = {
  day?: number;      // Day of year (optional)
  date: Date;
  tasks: Task[];
};

/**
 * Visualization & Navigation Types
 */
export type AppView = 'calendar' | 'monthly' | 'day-detail';

export type HeatmapDataPoint = {
  date: Date;
  intensity: number; // Derived from task count or complexity
};