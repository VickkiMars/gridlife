import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Shield } from 'lucide-react'; // Removed unused AlertCircle
import type { Squad, DayEntry, Task } from '../../types';
import { COLORS } from '../../types';

// --- Extended Types (Schema Requirements) ---

interface SquadMemberHistory {
  user_id: string;
  joined_at: string; // ISO Date
  left_at?: string;  // ISO Date (optional)
}

// Extending the base Squad type to support required features
interface ExtendedSquad extends Omit<Squad, 'member_ids'> {
  owner_timezone: string;
  member_history: SquadMemberHistory[]; // Replaces simple member_ids list for historical accuracy
  streak_freezes?: number; // Available "Shields"
  min_threshold: number;
}

interface ExtendedTask extends Omit<Task, 'impact_weight'> {
  contributor_id?: string;
  category_id?: string;
  impact_weight?: number;
}

interface Props {
  squad: Squad; // We will cast this to ExtendedSquad internally
  entries: DayEntry[];
  selectedDate: Date;
  onSelect?: (date: Date) => void;
  currentUserId?: string; // Required for "Social Pulse"
}

// --- Timezone Helper ---

// Returns 'YYYY-MM-DD' relative to a specific timezone
const getSquadDateKey = (date: Date, timeZone: string = 'UTC') => {
  try {
    return new Intl.DateTimeFormat('en-CA', { // en-CA is reliably YYYY-MM-DD
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone
    }).format(date);
  } catch {
    // Fallback if timezone is invalid
    return format(date, 'yyyy-MM-dd');
  }
};

export const SquadGrid: React.FC<Props> = ({ squad: rawSquad, entries, selectedDate, onSelect, currentUserId }) => {
  const squad = rawSquad as unknown as ExtendedSquad;
  
  // 1. Timezone Synchronization (Option 1: Owner's Timezone)
  const timezone = squad.owner_timezone || 'UTC';
  const dateKey = getSquadDateKey(selectedDate, timezone);
  
  // Check if the selected date is "Today" in the Squad's timezone
  const isSquadToday = dateKey === getSquadDateKey(new Date(), timezone);

  // 2. Ghost of the Departed (Historical Membership Logic)
  // Filter members who were actually part of the squad on the selectedDate
  const activeMembersOnDate = useMemo(() => {
    const targetTime = new Date(selectedDate).getTime();
    return squad.member_history.filter(m => {
      const joined = new Date(m.joined_at).getTime();
      const left = m.left_at ? new Date(m.left_at).getTime() : Infinity;
      return targetTime >= joined && targetTime <= left;
    }).map(m => m.user_id);
  }, [squad.member_history, selectedDate]);

  const members = activeMembersOnDate.length > 0 ? activeMembersOnDate : (rawSquad.member_ids || []);

  // 3. Data Gathering
  const contribMap = squad.contribution_status || {};
  const dayMap = contribMap[dateKey] || {};

  // Compute Active Set (Server Truth)
  const activeSet = new Set<string>();
  members.forEach((m) => {
    if (dayMap[m]) activeSet.add(m);
  });

  // Compute Performance Scores (Local + Whale Logic)
  const memberScores = useMemo(() => {
    return members.reduce<Record<string, number>>((acc, m) => {
      // Local heuristic: Try to find score from local entries if available
      const entry = entries.find(e => getSquadDateKey(new Date(e.date), timezone) === dateKey);
      let sum = 0;
      if (entry) {
        sum = entry.tasks
          .filter(t => {
            const extTask = t as unknown as ExtendedTask;
            return t.completed && (extTask.contributor_id || extTask.category_id) === m;
          })
          .reduce((s, t) => s + ((t as unknown as ExtendedTask).impact_weight || 0), 0);
      }
      acc[m] = sum;
      return acc;
    }, {});
  }, [entries, members, dateKey, timezone]);

  // 4. Whale Clause & Shield Logic
  const legends = members.filter(m => (memberScores[m] || 0) >= (squad.min_threshold || 1) * 3);
  const shieldsAvailable = squad.streak_freezes || 0;
  
  let activeCount = activeSet.size;
  let usedShield = false;

  if (activeCount < members.length) {
    // Apply Whales
    if (legends.length > 0) {
       const needed = members.length - activeCount;
       const carryPower = Math.min(needed, legends.length); // 1 Legend carries 1 person
       activeCount += carryPower;
    }
    
    // Apply Streak Freeze (Shield) if still failing and it's in the past
    // (We don't use shields for "Today" because there is still time to work)
    if (activeCount < members.length && !isSquadToday && shieldsAvailable > 0) {
      activeCount = members.length;
      usedShield = true;
    }
  }

  // 5. Squad Intensity (SI) Calculation
  // Average performance of those who contributed
  const totalScore = members.reduce((sum, m) => sum + (memberScores[m] || (activeSet.has(m) ? squad.min_threshold : 0)), 0);
  // Normalized against the expected total threshold.
  const expectedTotal = members.length * squad.min_threshold;
  const rawIntensity = expectedTotal > 0 ? (totalScore / expectedTotal) : 0;
  
  // Squad Strength (Completion %)
  const completionPercentage = members.length > 0 ? Math.round((activeCount / members.length) * 100) : 0;

  // 6. Visual Grid Construction
  const n = Math.max(1, members.length);
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);

  const cells = members.map((m) => {
    const isCurrentUser = m === currentUserId;
    const isFilled = activeSet.has(m); // True if they actually did the work
    const isCarried = !isFilled && completionPercentage === 100; // True if Whales/Shields saved them
    
    return { 
      id: m, 
      filled: isFilled, 
      carried: isCarried,
      isCurrentUser 
    };
  });

  // 7. Silent Accountability Trigger
  const currentUserCell = cells.find(c => c.isCurrentUser);
  const userIsBlocker = isSquadToday && currentUserCell && !currentUserCell.filled && !currentUserCell.carried;

  return (
    <div className={`p-3 rounded-xl border relative overflow-hidden transition-all duration-300 ${userIsBlocker ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : ''}`} style={{ backgroundColor: COLORS.surface, borderColor: userIsBlocker ? undefined : COLORS.border }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-gray-400 truncate max-w-[100px]">{squad.name || 'Squad'}</div>
          {usedShield && <Shield size={10} className="text-yellow-400" />}
        </div>
        <div className={`text-xs font-mono font-bold ${completionPercentage === 100 ? 'text-green-400' : 'text-gray-300'}`}>
          {completionPercentage}%
        </div>
      </div>

      {/* Grid Mosaic */}
      <div
        className="w-20 h-20 relative mx-auto cursor-pointer"
        onClick={() => onSelect && onSelect(selectedDate)}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: '100%',
          height: '100%',
          gap: 3
        }}>
          {cells.map((c) => (
            <div 
              key={c.id} 
              className={`
                relative rounded-[2px] transition-all duration-500
                ${c.isCurrentUser && !c.filled && isSquadToday ? 'animate-pulse' : ''}
              `}
              style={{
                backgroundColor: c.filled 
                  ? COLORS.performanceScale[4] // Solid Green
                  : c.carried 
                    ? COLORS.performanceScale[2] // Dim Green (Carried)
                    : COLORS.performanceScale[5], // Empty/Grey
                // Pulse Animation via Box Shadow for the current user
                boxShadow: (c.isCurrentUser && !c.filled && isSquadToday) 
                  ? '0 0 8px 1px rgba(59, 130, 246, 0.8)' 
                  : 'none',
                zIndex: c.isCurrentUser ? 10 : 1
              }} 
            />
          ))}
          {/* Fillers for visual squareness */}
          {Array.from({ length: (rows * cols) - cells.length }).map((_, i) => (
             <div key={`empty-${i}`} className="opacity-0" />
          ))}
        </div>
      </div>

      {/* Footer / Status Message */}
      <div className="mt-3 min-h-[16px] flex justify-center items-center">
        {userIsBlocker ? (
          // THE NUDGE
          <div className="flex items-center gap-1.5 animate-in slide-in-from-bottom-1 fade-in duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-blue-400">Your Turn</span>
          </div>
        ) : (
          <div className="text-[10px] text-gray-500 font-mono text-center">
            {completionPercentage === 100 
              ? <span className="text-green-500/80 tracking-wider">SQUAD SOLID</span> 
              : `${members.length - activeCount} Missing`
            }
          </div>
        )}
      </div>

      {/* Optional: Intensity Bar (SI) */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-green-500/30 transition-all duration-500" style={{ width: `${Math.min(100, rawIntensity * 100)}%` }} />
    </div>
  );
};

export default SquadGrid;