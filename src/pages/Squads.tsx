import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Copy, Lock, Trophy } from "lucide-react";

// Mock Data for UI Visualization
const MOCK_SQUADS = [
  { id: "1", name: "Deep Work Delta", members: 4, streak: 12, rank: "Diamond" },
  { id: "2", name: "Q1 Ship Crew", members: 3, streak: 4, rank: "Gold" },
];

const Squads: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"my-squads" | "invites">(
    "my-squads"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#161618] text-gray-200 font-sans">
      {/* Header */}
      <header className="border-b border-[#27272a] bg-[#161618] p-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Squad Command
            </h1>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus size={16} /> Create Squad
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#27272a] mb-8">
          <button
            onClick={() => setActiveTab("my-squads")}
            className={`pb-4 text-sm font-mono uppercase tracking-wider transition-colors ${
              activeTab === "my-squads"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Active Squads
          </button>
          <button
            onClick={() => setActiveTab("invites")}
            className={`pb-4 text-sm font-mono uppercase tracking-wider transition-colors ${
              activeTab === "invites"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Pending Invites{" "}
            <span className="ml-1 bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">
              2
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "my-squads" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_SQUADS.map((squad) => (
              <div
                key={squad.id}
                className="group relative bg-[#1c1c1f] border border-[#27272a] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Users size={24} />
                  </div>
                  <div className="px-2 py-1 rounded bg-[#27272a] border border-[#3f3f46] text-xs font-mono text-yellow-500 flex items-center gap-1">
                    <Trophy size={10} /> {squad.rank}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">
                  {squad.name}
                </h3>
                <p className="text-sm text-gray-500 font-mono mb-6">
                  {squad.members} / 5 Members
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {squad.streak} Day Streak
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#27272a] flex justify-between items-center">
                  <button className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-2">
                    <Copy size={12} /> Copy Invite Code
                  </button>
                  <button
                    onClick={() => navigate(`/squads/${squad.id}`)} // Fixed link
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
                  >
                    View Grid &rarr;
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State / Join Card */}
            <div className="border border-dashed border-[#27272a] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[#27272a] flex items-center justify-center text-gray-500 group-hover:text-blue-400 mb-4 transition-colors">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-300">
                Join Existing Squad
              </h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Have an invite code? Enter it to sync with your team.
              </p>
              <div className="mt-4 flex gap-2 w-full max-w-xs">
                <input
                  placeholder="Enter Code (e.g. SQ-882)"
                  className="bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-sm text-white w-full outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600/20 text-blue-400 px-3 py-2 rounded text-sm font-bold hover:bg-blue-600/30">
                  Join
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-mono">No pending invites found.</p>
          </div>
        )}
      </main>

      {/* Create Modal (Visual Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Initialize New Squad
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">
                  Squad Name
                </label>
                <input
                  className="w-full bg-[#09090b] border border-[#27272a] rounded p-2 text-white mt-1 outline-none focus:border-blue-500"
                  placeholder="e.g. Q4 Killers"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase">
                  Min. Daily Threshold
                </label>
                <input
                  type="range"
                  className="w-full mt-2 accent-blue-500"
                  min="1"
                  max="10"
                  defaultValue="5"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Casual (1)</span>
                  <span>Hardcore (10)</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Squads;
