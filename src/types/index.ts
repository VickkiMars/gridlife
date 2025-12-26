export const COLORS = {
  primary: "#3b82f6",     // Electric Blue
  background: "#0a0a0c",  // Deep Obsidian
  surface: "#161618",     // Panel Surface
  border: "#27272a",      // Subdued Border
  
  // Heatmap Scale (0 = Empty, 4 = Peak)
  levels: {
    0: '#545252ff',
    1: 'rgba(59, 130, 246, 0.25)',
    2: 'rgba(59, 130, 246, 0.50)',
    3: 'rgba(59, 130, 246, 0.75)',
    4: '#3b82f6',
  }
} as const;

export type TaskTag = 'DEV' | 'MTG' | 'ANA' | 'OPS' | 'WRK' | string;

export type Task = {
  id: string;
  title: string;
  tag: TaskTag;
  completed: boolean;
  date: Date;
};

export type DayEntry = {
  date: Date;
  tasks: Task[];
};

export type HeatmapDataPoint = {
  date: Date;
  intensity: number;
};