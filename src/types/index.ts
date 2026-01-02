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
  created_at: Date; // Timestamp when the task was created (for Shadow Grid)
  completed_at?: Date; // When the task was completed (used to visualize decay)
  impact_weight: number; // Impact weight 1-5 (required)
  status: 'open' | 'completed' | 'cancelled' | 'rolled_over';
  category_id?: string; // Mandatory category identifier (e.g. Work, Fitness)
};

export type DayEntry = {
  date: Date;
  tasks: Task[];
  isRecoverable?: boolean; // Marks days with zero-sum weight (no completed tasks)
  status?: 'active' | 'recovered' | 'missed'; // Track recovery state (recovered days count toward streak)
  recoveryAttemptedAt?: Date; // Timestamp of when recovery grace period started
};

// Squad types for collaborative grids
export type SquadLogic = 'all_or_nothing' | 'average' | 'weighted_sum';

export type Squad = {
  squad_id: string; // UUID
  name?: string;
  member_ids: string[]; // user ids
  min_threshold: number; // 1-10 (impact_weight sum per member required)
  squad_logic: SquadLogic;
  // contribution_status: dateKey -> map of userId -> boolean (met threshold?)
  contribution_status?: Record<string, Record<string, boolean>>;
  owner_timezone?: string; // e.g. 'UTC', 'Africa/Lagos'
  membership_history?: Array<{ user_id: string; start_at: Date; end_at?: Date }>;
  // optional squad shields (streak freeze)
  squad_shields?: number;
};

export type HeatmapDataPoint = {
  date: Date;
  intensity: number;
  performanceScore?: number; // Normalized score 0-1 based on weighted completion
  // Integrity score I = CompletedWeights / TotalCreatedWeights (0-1)
  integrityScore?: number;
  intentionVolume?: number; // Sum of impact_weight created on this date
  executionVolume?: number; // Sum of impact_weight completed on this date
  isAllDone?: boolean;
  status?: 'active' | 'recovered' | 'missed'; // Track recovery state
  isGhost?: boolean; // True if this is a recovered/ghost square
  overlayScores?: Record<string, number>; // category -> normalized score (0-1)
  riskLevel?: 'none' | 'warning' | 'high'; // Burnout risk level for the day
};