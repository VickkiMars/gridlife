export const COLORS = {
  primary: "#3b82f6",     // Electric Blue
  background: "#0a0a0c",  // Deep Obsidian
  surface: "#161618",     // Panel Surface
  border: "#27272a",      // Subdued Border
  
  // Heatmap Scale (0 = Empty, 4 = Peak) - Legacy
  levels: {
    0: '#545252ff',
    1: 'rgba(59, 130, 246, 0.25)',
    2: 'rgba(59, 130, 246, 0.50)',
    3: 'rgba(59, 130, 246, 0.75)',
    4: '#3b82f6',
  },
  
  // Performance Score Scale (Light to Dark Green) - Normalized 0-1
  performanceScale: [
    '#74c69d', // Lightest green (0.0-0.2)
    '#52b788', // Light green (0.2-0.4)
    '#40916c', // Medium green (0.4-0.6)
    '#2d6a4f', // Dark green (0.6-0.8)
    '#1a4d2e', // Darkest green (0.8-1.0)
    '#545252ff' // Empty (gray)
  ]
} as const;

export type TaskTag = 'DEV' | 'MTG' | 'ANA' | 'OPS' | 'WRK' | string;

export type Task = {
  id: string;
  title: string;
  tag: TaskTag;
  completed: boolean;
  date: Date;
  weight: number; // Impact weight 1-10 (required)
  category_id?: string; // Mandatory category identifier (e.g. Work, Fitness)
};

export type DayEntry = {
  date: Date;
  tasks: Task[];
  isRecoverable?: boolean; // Marks days with zero-sum weight (no completed tasks)
  status?: 'active' | 'recovered' | 'missed'; // Track recovery state (recovered days count toward streak)
  recoveryAttemptedAt?: Date; // Timestamp of when recovery grace period started
};

export type HeatmapDataPoint = {
  date: Date;
  intensity: number;
  performanceScore?: number; // Normalized score 0-1 based on weighted completion
  isAllDone?: boolean;
  status?: 'active' | 'recovered' | 'missed'; // Track recovery state
  isGhost?: boolean; // True if this is a recovered/ghost square
  overlayScores?: Record<string, number>; // category -> normalized score (0-1)
  riskLevel?: 'none' | 'warning' | 'high'; // Burnout risk level for the day
};