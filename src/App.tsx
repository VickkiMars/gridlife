import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Upload,
  CheckCircle,
  Circle,
  Calendar as CalendarIcon,
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Edit,
  X,
  Download,
} from "lucide-react";
import {
  format,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  isSameDay,
  isBefore,
  addDays,
  subDays,
  startOfToday,
  startOfWeek,
  endOfWeek,
  eachMonthOfInterval,
  differenceInDays,
  parseISO,
} from "date-fns";

// --- Types ---
type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type DayEntry = {
  day: number; // Day of year (1-366)
  date: Date;
  tasks: Task[];
};

type MonthLabel = {
  name: string;
  index: number; // Column index in the grid
  col: number; // Visual column position
};

type AppView = 'calendar' | 'day-detail';

// Mature color scheme for tech startup
const COLOR_SCHEME = {
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  surface: {
    elevated: '#ffffff',
    card: '#ffffff',
    modal: '#ffffff',
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    strong: '#94a3b8',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    muted: '#94a3b8',
  },
  accent: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  chart: {
    level0: '#f1f5f9', // No activity
    level1: '#c7d2fe', // Level 1
    level2: '#818cf8', // Level 2
    level3: '#4f46e5', // Level 3
    level4: '#3730a3', // Level 4
  },
};

// --- Helper: Color Logic ---
const getCellColor = (tasks: Task[]) => {
  if (!tasks || tasks.length === 0) return COLOR_SCHEME.chart.level0;
  const completedCount = tasks.filter((t) => t.completed).length;
  
  if (completedCount === 0) return COLOR_SCHEME.chart.level0;
  if (completedCount === 1) return COLOR_SCHEME.chart.level1;
  if (completedCount === 2) return COLOR_SCHEME.chart.level2;
  if (completedCount === 3) return COLOR_SCHEME.chart.level3;
  return COLOR_SCHEME.chart.level4;
};

// --- Tooltip Component ---
interface TooltipProps {
  date: Date;
  tasks: Task[];
  x: number;
  y: number;
  visible: boolean;
  showDateOnly: boolean;
}

const Tooltip = ({ date, tasks, x, y, visible, showDateOnly }: TooltipProps) => {
  if (!visible) return null;

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const taskText = completedCount === 1 ? 'task' : 'tasks';

  return (
    <div
      className="fixed z-50 pointer-events-none transition-opacity duration-150"
      style={{
        left: `${x}px`,
        top: `${y - 100}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-white text-sm rounded-lg py-3 px-4 w-64 shadow-xl border border-gray-200">
        <div className="font-medium border-b border-gray-100 pb-2 mb-3">
          <div className="text-gray-900 font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</div>
          {!showDateOnly && (
            <div className="text-gray-600 text-xs font-normal mt-1">
              {completedCount} of {totalCount} {taskText} completed
            </div>
          )}
        </div>
        
        {!showDateOnly && tasks.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                {t.completed ? (
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={14} className="text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={`text-sm truncate ${
                    t.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-700"
                  }`}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        ) : !showDateOnly ? (
          <span className="text-gray-500 italic text-sm">No tasks for this day</span>
        ) : null}
      </div>
      {/* Arrow */}
      <div className="w-3 h-3 bg-white rotate-45 absolute left-1/2 -bottom-1.5 -translate-x-1/2 border-r border-b border-gray-200"></div>
    </div>
  );
};

// --- Cell Component ---
interface CellProps {
  date: Date;
  tasks: Task[];
  isFuture: boolean;
  isSelected: boolean;
  onClick: (date: Date) => void;
  onHover: (date: Date, x: number, y: number) => void;
  onLeave: () => void;
  isInRange: boolean;
}

const Cell = ({ 
  date, 
  tasks, 
  isFuture, 
  isSelected, 
  onClick, 
  onHover,
  onLeave,
  isInRange 
}: CellProps) => {
  const color = getCellColor(tasks);
  const cellRef = React.useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!cellRef.current || !isInRange) return;
    
    const rect = cellRef.current.getBoundingClientRect();
    onHover(date, rect.left + 7.5, rect.top + 7.5);
  };

  return (
    <div
      ref={cellRef}
      className="relative"
      onClick={() => onClick(date)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      style={{
        width: '15px',
        height: '15px',
        margin: '2px',
        borderRadius: '2px',
        backgroundColor: color,
        cursor: isInRange ? 'pointer' : 'default',
        opacity: isInRange ? 1 : 0.3,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Selected state */}
      {isSelected && (
        <div
          className="absolute inset-[-2px] border border-blue-500 rounded-[3px] pointer-events-none"
        />
      )}
      
      {/* Hover effect */}
      {isInRange && (
        <div className="absolute inset-0 hover:bg-white hover:bg-opacity-20 rounded-[2px] pointer-events-none" />
      )}
    </div>
  );
};

// --- Day Detail Component ---
interface DayDetailProps {
  date: Date;
  tasks: Task[];
  onClose: () => void;
  onUpdateTasks: (date: Date, tasks: Task[]) => void;
}

const DayDetail = ({ date, tasks, onClose, onUpdateTasks }: DayDetailProps) => {
  const [localTasks, setLocalTasks] = useState<Task[]>([...tasks]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const dayOfYear = differenceInDays(date, startOfYear(date)) + 1;

  const handleToggleTask = (taskId: string) => {
    setLocalTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `${dayOfYear}-${Date.now()}`,
        title: newTaskTitle.trim(),
        completed: false,
      };
      setLocalTasks(prev => [...prev, newTask]);
      setNewTaskTitle("");
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setLocalTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleSave = () => {
    onUpdateTasks(date, localTasks);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const completedCount = localTasks.filter(t => t.completed).length;
  const totalCount = localTasks.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="text-xl font-semibold">{format(date, "EEEE")}</h2>
                <p className="text-blue-100 text-sm">{format(date, "MMMM do, yyyy")}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Save size={18} />
              Save
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Task Stats */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {totalCount}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalCount - completedCount}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{
                  width: totalCount > 0 
                    ? `${(completedCount / totalCount) * 100}%`
                    : '0%'
                }}
              />
            </div>
          </div>

          {/* Add Task */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {localTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tasks for this day</p>
                <p className="text-sm">Add your first task above</p>
              </div>
            ) : (
              localTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.completed ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-gray-400 rounded-full hover:border-blue-500 transition-colors" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span
                      className={`block ${task.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [data, setData] = useState<DayEntry[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    date: Date;
    x: number;
    y: number;
    showDateOnly: boolean;
  }>({
    visible: false,
    date: new Date(),
    x: 0,
    y: 0,
    showDateOnly: true,
  });
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const today = startOfToday();

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('gridlife-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const formattedData: DayEntry[] = parsedData.map((entry: any) => ({
          ...entry,
          date: parseISO(entry.date),
        }));
        setData(formattedData);
      } catch (err) {
        console.error('Failed to load saved data:', err);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('gridlife-data', JSON.stringify(data));
    }
  }, [data]);

  // Generate exact GitHub-style calendar grid (53 columns, 7 rows)
  const { grid, months, dayLabels, totalWeeks } = useMemo(() => {
    // GitHub shows exactly 1 year of data (53 weeks)
    const oneYearAgo = subDays(today, 364); // 364 days = 52 weeks
    const startDate = startOfWeek(oneYearAgo, { weekStartsOn: 0 }); // Align to Sunday
    
    // Create array for 53 weeks * 7 days = 371 days
    const days = eachDayOfInterval({ 
      start: startDate, 
      end: addDays(startDate, 370) // 371 days total
    });

    // Group into 53 weeks of 7 days each (GitHub style)
    const weeks: Date[][] = [];
    for (let i = 0; i < 53; i++) {
      weeks.push(days.slice(i * 7, (i * 7) + 7));
    }

    // Create the 7x53 grid (rows = days of week, columns = weeks)
    const grid: (Date | null)[][] = Array(7).fill(null).map(() => Array(53).fill(null));
    
    weeks.forEach((week, weekIndex) => {
      week.forEach((date, dayOfWeek) => {
        grid[dayOfWeek][weekIndex] = date;
      });
    });

    // Calculate month labels with better positioning
    const monthLabels: MonthLabel[] = [];
    const currentYear = today.getFullYear();
    
    // Get all months in the current year
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });
    
    monthsInYear.forEach((monthDate) => {
      // Find which week column contains the 1st day of this month
      for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
        const week = weeks[weekIndex];
        const firstOfMonthIndex = week.findIndex(date => 
          date && 
          date.getMonth() === monthDate.getMonth() && 
          date.getDate() === 1
        );
        
        if (firstOfMonthIndex !== -1) {
          // Use the exact cell position for alignment
          monthLabels.push({
            name: format(monthDate, "MMM"),
            index: weekIndex,
            col: firstOfMonthIndex,
          });
          break;
        }
      }
    });

    // Day labels (Monday to Sunday)
    const dayLabels = [
      { label: 'Mon', row: 1 },
      { label: 'Wed', row: 3 },
      { label: 'Fri', row: 5 },
      { label: 'Sun', row: 0 },
    ];

    return { grid, months: monthLabels, dayLabels, totalWeeks: weeks.length };
  }, [today]);

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(json)) {
          throw new Error("JSON must be an array");
        }
        
        const existingData = data.length > 0 ? data : [];
        
        const formattedData: DayEntry[] = json.map((entry: any) => {
          if (typeof entry.Day !== 'number' || !Array.isArray(entry.Tasks)) {
            throw new Error(`Invalid entry for day ${entry.Day}`);
          }

          const year = today.getFullYear();
          const date = new Date(year, 0, entry.Day);
          
          const existingDay = existingData.find(d => d.day === entry.Day);
          
          return {
            day: entry.Day,
            date,
            tasks: entry.Tasks.map((task: string | {title: string, completed: boolean}, idx: number) => {
              const taskId = `${entry.Day}-${idx}`;
              
              if (typeof task === 'object' && task !== null) {
                return {
                  id: taskId,
                  title: task.title,
                  completed: task.completed || false,
                };
              }
              
              const existingTask = existingDay?.tasks.find(t => t.id === taskId);
              
              return {
                id: taskId,
                title: task as string,
                completed: existingTask?.completed || false,
              };
            }),
          };
        });

        setData(formattedData);
      } catch (err) {
        alert(`Invalid JSON format: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  // Get tasks for a specific date
  const getTasksForDate = useMemo(() => {
    return (date: Date | null) => {
      if (!date) return [];
      const start = startOfYear(date);
      const dayOfYear = differenceInDays(date, start) + 1;
      const dayEntry = data.find((d) => d.day === dayOfYear);
      
      if (!dayEntry) {
        return [];
      }
      
      return dayEntry.tasks || [];
    };
  }, [data]);

  // Check if date is in the current year range
  const isDateInRange = (date: Date | null) => {
    if (!date) return false;
    const startOfYearDate = startOfYear(today);
    const endOfYearDate = endOfYear(today);
    return date >= startOfYearDate && date <= endOfYearDate;
  };

  // Handle cell hover with delay
  const handleCellHover = (date: Date, x: number, y: number) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Show tooltip with date only
    setTooltip({
      visible: true,
      date,
      x,
      y,
      showDateOnly: true,
    });

    // Set timeout to show tasks after 2 seconds
    hoverTimeoutRef.current = setTimeout(() => {
      setTooltip(prev => ({
        ...prev,
        showDateOnly: false,
      }));
    }, 2000);
  };

  const handleCellLeave = () => {
    // Clear timeout on mouse leave
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Handle cell click
  const handleCellClick = (date: Date) => {
    if (!isDateInRange(date)) return;
    setSelectedDate(date);
    setCurrentView('day-detail');
  };

  // Update tasks for a specific date
  const handleUpdateTasks = (date: Date, updatedTasks: Task[]) => {
    const start = startOfYear(date);
    const dayOfYear = differenceInDays(date, start) + 1;
    
    setData(prevData => {
      const existingIndex = prevData.findIndex(d => d.day === dayOfYear);
      
      if (existingIndex >= 0) {
        const newData = [...prevData];
        newData[existingIndex] = {
          ...newData[existingIndex],
          tasks: updatedTasks,
        };
        return newData;
      } else {
        return [
          ...prevData,
          {
            day: dayOfYear,
            date,
            tasks: updatedTasks,
          },
        ];
      }
    });
  };

  // Export data as JSON
  const exportData = () => {
    const exportData = data.map(day => ({
      Day: day.day,
      Tasks: day.tasks.map(task => ({
        title: task.title,
        completed: task.completed
      }))
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `gridlife-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Close day detail view
  const handleCloseDayDetail = () => {
    setCurrentView('calendar');
    setSelectedDate(null);
  };

  // Render calendar grid
  const renderCalendarGrid = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* Month Labels - Improved positioning */}
      <div className="flex mb-3 ml-12 relative h-6">
        {months.map((month, idx) => {
          // Calculate position based on exact cell alignment
          const leftPos = month.index * 19 + (month.col * 19) / 7;
          return (
            <div
              key={`${month.name}-${idx}`}
              className="absolute text-xs text-gray-600 font-medium whitespace-nowrap"
              style={{
                left: `${leftPos}px`,
              }}
            >
              {month.name}
            </div>
          );
        })}
      </div>

      <div className="flex items-start">
        {/* Day Labels - Optimized spacing */}
        <div className="flex flex-col mr-3 w-10">
          {dayLabels.map(({ label, row }) => (
            <div
              key={label}
              className="text-xs text-gray-600 font-medium flex items-center justify-end pr-2"
              style={{
                height: '19px',
                marginTop: row === 0 ? '2px' : '0',
                marginBottom: row === 6 ? '2px' : '0',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid Container */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-block">
            {/* Grid Rows */}
            {grid.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="flex"
                style={{
                  marginBottom: '4px',
                }}
              >
                {row.map((date, colIndex) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${rowIndex}-${colIndex}`}
                        style={{
                          width: '15px',
                          height: '15px',
                          margin: '2px',
                          borderRadius: '2px',
                          opacity: 0,
                        }}
                      />
                    );
                  }

                  const tasks = getTasksForDate(date);
                  const isFuture = !isBefore(date, today) && !isSameDay(date, today);
                  const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                  const isInRange = isDateInRange(date);

                  return (
                    <Cell
                      key={date.toISOString()}
                      date={date}
                      tasks={tasks}
                      isFuture={isFuture}
                      isSelected={isSelected}
                      isInRange={isInRange}
                      onClick={handleCellClick}
                      onHover={handleCellHover}
                      onLeave={handleCellLeave}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <Tooltip
        date={tooltip.date}
        tasks={getTasksForDate(tooltip.date)}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
        showDateOnly={tooltip.showDateOnly}
      />

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Click any day to add/edit tasks
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-500 text-xs">Less</span>
          {Object.values(COLOR_SCHEME.chart).map((color, idx) => (
            <div
              key={idx}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: color,
              }}
            />
          ))}
          <span className="text-gray-500 text-xs">More</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GridLife</h1>
            <p className="text-gray-600 text-sm mt-1">
              GitHub-style productivity tracker
            </p>
          </div>
          
          <div className="flex gap-2">
            <label className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
              <Upload size={16} />
              <span className="text-sm font-medium">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={16} />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Main Calendar Grid - Always visible */}
        {renderCalendarGrid()}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, day) => sum + day.tasks.length, 0)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, day) => 
                sum + day.tasks.filter(t => t.completed).length, 0
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Active Days</div>
            <div className="text-2xl font-bold text-blue-600">
              {data.filter(day => day.tasks.length > 0).length}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How to use</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Hover over any day to see tasks (date shows immediately, tasks appear after 2 seconds)</li>
            <li>• Click any day to add or edit tasks</li>
            <li>• Color intensity represents task completion level</li>
            <li>• Use Import/Export buttons to manage your data</li>
          </ul>
        </div>
      </div>

      {/* Day Detail Modal */}
      {currentView === 'day-detail' && selectedDate && (
        <DayDetail
          date={selectedDate}
          tasks={getTasksForDate(selectedDate)}
          onClose={handleCloseDayDetail}
          onUpdateTasks={handleUpdateTasks}
        />
      )}
    </div>
  );
};

export default App;