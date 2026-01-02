import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Shield, History, Activity } from 'lucide-react';
import { startOfYear, eachDayOfInterval, isSameDay, format } from 'date-fns';

import { MonthlyHeatmap } from '../components/visualization/MonthlyHeatmap';
import { SquadGrid } from '../components/visualization/SquadGrid';
import { usePersistentData } from '../hooks/usePersistentData';
import { type HeatmapDataPoint } from '../types';

// Mock Data Generators (Since we don't have a real backend yet)
const generateMockMemberData = (memberId: string) => { // memberId param used for potential seeding in future
  // Simulates a user's completion history for the year
  return eachDayOfInterval({ start: startOfYear(new Date()), end: new Date() }).map(date => ({
    date,
    completed: Math.random() > 0.3 // 70% success rate
  }));
};

export const SquadDetail: React.FC = () => {
  const { squadId } = useParams();
  const navigate = useNavigate();
  const { squads } = usePersistentData() as any;

  // 1. Find the Squad
  const squad = squads.find((s: any) => s.id === squadId) || squads[0]; 

  // 2. The Aggregation Engine
  const squadHeatmapData = useMemo<HeatmapDataPoint[]>(() => {
    const days = eachDayOfInterval({ start: startOfYear(new Date()), end: new Date() });
    
    // Generate mock data for members
    const members = squad.member_ids || ['user1', 'user2', 'user3', 'user4'];
    const memberDataMap = members.reduce((acc: any, mId: string) => {
      acc[mId] = generateMockMemberData(mId);
      return acc;
    }, {});

    return days.map(date => {
      let activeCount = 0;
      members.forEach((mId: string) => {
        const dayRecord = memberDataMap[mId].find((d: any) => isSameDay(d.date, date));
        if (dayRecord?.completed) activeCount++;
      });

      const completionRatio = members.length > 0 ? activeCount / members.length : 0;
      
      let intensity = 0;
      if (completionRatio === 1) intensity = 5;
      else if (completionRatio >= 0.75) intensity = 3;
      else if (completionRatio >= 0.5) intensity = 1;
      
      return {
        date,
        intensity,
        performanceScore: completionRatio,
        intentionVolume: members.length,
        executionVolume: activeCount
      };
    });
  }, [squad]);

  const currentStreak = 12; 
  const winRate = 88; 

  if (!squad) return <div>Loading Squad...</div>;

  return (
    <div className="min-h-screen bg-[#161618] text-gray-200 font-sans">
      {/* Header */}
      <nav className="border-b border-[#27272a] bg-[#161618]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/squads')}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Command
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold tracking-tight text-white">{squad.name}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left: Squad Stats */}
          <div className="lg:col-span-8 flex flex-col justify-end">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">{squad.name}</h1>
              <p className="text-gray-500 max-w-xl">
                Operating on <span className="text-blue-400 font-mono">GMT+1</span>. 
                Strict "All-or-Nothing" protocol active.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div className="bg-[#1c1c1f] border border-[#27272a] p-4 rounded-xl">
                 <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-1">
                   <Trophy size={12} className="text-yellow-500" /> Current Streak
                 </div>
                 <div className="text-2xl font-bold text-white font-mono">{currentStreak}</div>
               </div>
               <div className="bg-[#1c1c1f] border border-[#27272a] p-4 rounded-xl">
                 <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-1">
                   <Activity size={12} className="text-blue-500" /> Win Rate
                 </div>
                 <div className="text-2xl font-bold text-white font-mono">{winRate}%</div>
               </div>
               <div className="bg-[#1c1c1f] border border-[#27272a] p-4 rounded-xl">
                 <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-1">
                   <Shield size={12} className="text-emerald-500" /> Shields
                 </div>
                 <div className="text-2xl font-bold text-white font-mono">{squad.streak_freezes || 0}</div>
               </div>
               <div className="bg-[#1c1c1f] border border-[#27272a] p-4 rounded-xl">
                 <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-1">
                   <Users size={12} className="text-purple-500" /> Members
                 </div>
                 <div className="text-2xl font-bold text-white font-mono">{squad.member_ids?.length || 4}</div>
               </div>
            </div>
          </div>

          {/* Right: The Micro-Grid (Today's Status) */}
          <div className="lg:col-span-4">
             <div className="bg-[#1c1c1f] border border-[#27272a] p-6 rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 z-0" />
                <h3 className="relative z-10 text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Live Status • {format(new Date(), 'MMM dd')}</h3>
                <div className="relative z-10 scale-125">
                  <SquadGrid 
                    squad={squad} 
                    entries={[]} 
                    selectedDate={new Date()} 
                    currentUserId="user1" 
                  />
                </div>
             </div>
          </div>
        </div>

        {/* The Macro-Grid: Collective History */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History size={16} className="text-gray-500" />
                Collective Integrity
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#3b82f6] rounded-[2px]" /> 100% Active
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#3b82f6]/40 rounded-[2px]" /> Partial
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#27272a] rounded-[2px]" /> Failed
                </div>
              </div>
           </div>

           {/* Reuse MonthlyHeatmap with Squad Data */}
           <div className="h-[300px]">
             <MonthlyHeatmap 
                data={squadHeatmapData} 
                selectedDate={new Date()} 
                onSelect={() => {}} 
                mode="performance"
             />
           </div>
        </div>

        {/* Member Leaderboard */}
        <div className="mt-12 pt-12 border-t border-[#27272a]">
           <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Squad Roster</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(squad.member_ids || ['user1', 'user2', 'user3', 'user4']).map((m: string, i: number) => (
                <div key={m} className="flex items-center justify-between p-4 bg-[#1c1c1f] border border-[#27272a] rounded-lg">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800'}`}>
                        {m.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-200">Operative {m}</div>
                        <div className="text-xs text-gray-500 font-mono">Last active: Today</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-bold text-white font-mono">98%</div>
                      <div className="text-[10px] text-gray-500 uppercase">Consistency</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </main>
    </div>
  );
};

export default SquadDetail;