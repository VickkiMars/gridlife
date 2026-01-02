import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Activity,
  Users,
  Grid,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

/**
 * Landing Component
 * Aesthetic: Industrial Dark, Monospace Accents, Neon Blue (#3b82f6)
 */
const Landing: React.FC = () => {
  const navigate = useNavigate();

  // Background Grid Pattern
  const gridPattern =
    "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)";

  return (
    <div className="bg-[#161618] text-gray-200 font-sans antialiased min-h-screen selection:bg-[#3b82f6]/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-[#27272a] bg-[#161618]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#3b82f6] rounded flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Gridlife.io
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-xs font-mono text-gray-400 uppercase tracking-widest">
              <button
                onClick={() => navigate("/create")}
                className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                The Grid
              </button>
              <button
                onClick={() => navigate("/squads")}
                className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                Squads
              </button>
              <button
                onClick={() => navigate("/methodica")}
                className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                Method
              </button>
              <button
                onClick={() => navigate("/integrations")}
                className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                Integrations
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer"
              >
                Pricing
              </button>
            </div>

            <div className="flex items-center gap-4">
              <a
                className="text-xs font-mono text-gray-400 hover:text-white hidden sm:block uppercase"
                href="#"
              >
                Log in
              </a>
              <button
                onClick={() => navigate("/create")}
                className="bg-[#27272a] hover:bg-[#3b82f6] hover:text-white text-gray-300 text-xs font-mono uppercase px-4 py-2 rounded border border-[#3f3f46] hover:border-[#3b82f6] transition-all duration-300"
              >
                Initialize Grid
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Dynamic Grid Background Overlay */}
        <div
          className="absolute inset-0 z-0 bg-[length:40px_40px] opacity-[0.3] pointer-events-none"
          style={{
            backgroundImage: gridPattern,
            maskImage:
              "radial-gradient(circle at center, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black, transparent 80%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            System V2.4 Active
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 pb-2">
            Visual proof of <br />
            your <span className="text-[#3b82f6]">consistency</span>.
          </h1>

          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            Don't just list tasks. Visualize your effort, detect burnout
            patterns, and lock in your daily output with squad-based
            accountability.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => navigate("/create")}
              className="bg-[#3b82f6] text-white h-12 px-8 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2 group"
            >
              <span>Build Your Grid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border border-[#3f3f46] text-gray-300 h-12 px-8 rounded-lg font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>See the Method</span>
            </button>
          </div>

          {/* Visualization Dashboard Component */}
          <div className="mt-20 relative max-w-5xl mx-auto perspective-[2000px]">
            {/* Glow effect behind the dashboard */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-50" />

            <div className="relative bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden aspect-[16/9] grid grid-cols-4 grid-rows-3 gap-px bg-[#27272a] rotate-x-12 transform-gpu transition-transform hover:rotate-x-0 duration-700">
              {/* Main Chart Area */}
              <div className="col-span-3 row-span-2 bg-[#161618] p-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                      Execution Volume
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-[#27272a]"
                      />
                    ))}
                  </div>
                </div>

                {/* Simulated Heatmap Bars */}
                <div className="w-full h-40 flex items-end justify-between gap-1">
                  {[30, 50, 45, 70, 85, 95, 60, 40, 35].map((h, i) => (
                    <div key={i} className="w-full relative group/bar">
                      <div
                        style={{ height: `${h}%` }}
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          h > 80
                            ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            : h > 50
                            ? "bg-blue-500/60"
                            : "bg-[#27272a]"
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-600 uppercase">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>
              </div>

              {/* Metric Card 1 */}
              <div className="col-span-1 row-span-1 bg-[#161618] p-6 flex flex-col justify-between hover:bg-[#1c1c1f] transition-colors border-l border-[#27272a]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  Integrity Score
                </span>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  98.2<span className="text-gray-600 text-lg">%</span>
                </div>
                <div className="text-[10px] text-blue-400 flex items-center mt-1 font-mono">
                  ▲ HIGH DISCIPLINE
                </div>
              </div>

              {/* Metric Card 2 */}
              <div className="col-span-1 row-span-1 bg-[#161618] p-6 flex flex-col justify-between hover:bg-[#1c1c1f] transition-colors border-l border-[#27272a]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  Burnout Risk
                </span>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  12<span className="text-gray-600 text-lg">%</span>
                </div>
                <div className="w-full bg-[#27272a] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[12%] shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                </div>
              </div>

              {/* Bottom Wide Card */}
              <div className="col-span-2 row-span-1 bg-[#161618] p-6 flex items-center justify-between hover:bg-[#1c1c1f] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-200 text-sm">
                      Squad Status
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">
                      4/5 Members Active • 0 Slots Missing
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Card */}
              <div className="col-span-2 row-span-1 bg-[#09090b] p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase text-gray-500">
                    System Log
                  </span>
                </div>
                <div className="font-mono text-[10px] text-gray-500 space-y-1.5">
                  <p>
                    <span className="text-blue-500">➜</span>{" "}
                    calculating_streak(days: 42)
                  </p>
                  <p>
                    <span className="text-blue-500">➜</span>{" "}
                    syncing_squad_state...
                  </p>
                  <p className="text-emerald-500">
                    ➜ all_systems_nominal [12ms]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="py-24 bg-[#161618] relative border-t border-[#27272a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-xs font-mono text-blue-500 tracking-widest uppercase mb-3">
              Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Engineered for High-Velocity Output
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Feature 1: Temporal Heatmaps */}
            <div className="md:col-span-2 rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group hover:border-[#3f3f46] transition-colors">
              <div className="p-8 h-full flex flex-col z-10 relative">
                <div className="mb-auto">
                  <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                    <Grid className="text-gray-200 w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">
                    Temporal Heatmaps
                  </h4>
                  <p className="text-gray-400 text-sm max-w-md">
                    Visualize your workflow intensity across time. Use Shadow
                    Mode to compare your <strong>Intention</strong> (Plans) vs
                    your <strong>Execution</strong> (Reality).
                  </p>
                </div>
                {/* Decorative Grid */}
                <div className="mt-8 w-full h-48 bg-[#09090b] rounded border border-[#27272a] relative overflow-hidden">
                  {/* Blue Gradient Mesh */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-4 divide-x divide-y divide-[#27272a]">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className={`transition-opacity duration-1000 ${
                          i % 7 === 0 ? "bg-blue-500/20" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Squads */}
            <div className="rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group p-8 hover:border-[#3f3f46] transition-colors">
              <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                <Users className="text-gray-200 w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">
                Social Loss Aversion
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Join a Squad. If you miss a day, the grid breaks for everyone.
                Leverage social pressure to maintain discipline.
              </p>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded bg-[#27272a] border border-[#3f3f46] text-[10px] font-mono text-gray-400">
                  Whale Clause
                </div>
                <div className="px-3 py-1 rounded bg-[#27272a] border border-[#3f3f46] text-[10px] font-mono text-gray-400">
                  Pulse Sync
                </div>
              </div>
            </div>

            {/* Feature 3: Burnout Guard */}
            <div className="rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group p-8 hover:border-[#3f3f46] transition-colors">
              <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                <ShieldAlert className="text-gray-200 w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">
                Burnout Protection
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Algorithmic detection of "Grind Risks" (High Volume / Low
                Variance). The system forces you to rest before you break.
              </p>
              <div className="mt-6 p-3 bg-red-500/5 border border-red-500/20 rounded flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] text-red-400 font-mono uppercase">
                  Risk Level: Critical (&gt;80%)
                </span>
              </div>
            </div>

            {/* Feature 4: Proof of Work */}
            <div className="md:col-span-2 rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group hover:border-[#3f3f46] transition-colors">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#09090b] to-transparent pointer-events-none" />
              <div className="p-8 h-full flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                    <BarChart3 className="text-gray-200 w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">
                    Proof of Work
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Generate high-fidelity visual résumés of your consistency.
                    Export your "Year in Review" instantly to prove your
                    discipline to the world.
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-[#09090b] rounded border border-[#27272a] p-4 shadow-inner">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase mb-4">
                      <span>Export Preview</span>
                      <span>2025</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold">98%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-24 bg-[#27272a] rounded overflow-hidden">
                          <div className="h-full w-[80%] bg-blue-500" />
                        </div>
                        <div className="h-2 w-20 bg-[#27272a] rounded overflow-hidden">
                          <div className="h-full w-[60%] bg-indigo-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview / Code Block Section */}
      <section className="py-24 border-t border-[#27272a] bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Built for the disciplined.
              </h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 rounded bg-[#161618] border-l-2 border-blue-500 transition-all">
                  <h4 className="font-bold text-gray-200 text-sm font-mono uppercase">
                    Developers
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Track deep work streaks and prevent burnout cycles.
                  </p>
                </button>
                <button className="w-full text-left p-4 rounded hover:bg-[#161618] border-l-2 border-transparent transition-all opacity-60 hover:opacity-100">
                  <h4 className="font-bold text-gray-200 text-sm font-mono uppercase">
                    Founders
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Visualize "Intention vs Reality" for project roadmaps.
                  </p>
                </button>
                <button className="w-full text-left p-4 rounded hover:bg-[#161618] border-l-2 border-transparent transition-all opacity-60 hover:opacity-100">
                  <h4 className="font-bold text-gray-200 text-sm font-mono uppercase">
                    High Performers
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Use Squads to enforce daily habits with accountability.
                  </p>
                </button>
              </div>
            </div>

            <div className="lg:col-span-8">
              {/* Terminal Code Preview */}
              <div className="rounded-xl border border-[#27272a] bg-[#000000] p-6 font-mono text-sm relative shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-[#27272a] pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  <div className="ml-auto text-xs text-gray-600">
                    gridlife-cli — v2.4.0
                  </div>
                </div>
                <div className="space-y-2 text-gray-400">
                  <p>$ kinetics analyze --range=week --output=json</p>
                  <p className="text-blue-500">
                    ➜ Initializing Analytics Engine...
                  </p>
                  <p>➜ Calculating Integrity Score...</p>
                  <p>➜ Detecting Streak Hazards...</p>
                  <br />
                  <p className="text-emerald-500">✔ WEEKLY REPORT READY</p>
                  <div className="pl-4 border-l border-[#27272a] text-xs space-y-1 mt-2">
                    <p>
                      Total_Focus: <span className="text-white">42h</span>
                    </p>
                    <p>
                      Consistency: <span className="text-white">98.4%</span>
                    </p>
                    <p>
                      Top_Category: <span className="text-blue-400">DEV</span>
                    </p>
                    <p>
                      Burnout_Risk: <span className="text-green-500">LOW</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#161618]">
        <div
          className="absolute inset-0 bg-[length:32px_32px] opacity-[0.1]"
          style={{ backgroundImage: gridPattern }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
            Optimize your flow state.
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            Join the network of high-performance individuals visualizing their
            productivity DNA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/create")}
              className="bg-white text-black h-14 px-8 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-all"
            >
              Initialize Free Tier
            </button>
            <button className="bg-transparent border border-[#27272a] text-gray-300 h-14 px-8 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#27272a] transition-all">
              Read Documentation
            </button>
          </div>

          <div className="mt-16 pt-12 border-t border-[#27272a] grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">15+</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Days Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">0</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Missing Slots
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">98%</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Consistency
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">
                100%
              </div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Data Ownership
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#09090b] border-t border-[#27272a] py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Activity className="text-white w-3 h-3" />
                </div>
                <span className="font-bold text-gray-200">Gridlife.io</span>
              </div>
              <p className="text-gray-500 text-xs">
                Quantifying the invisible.
                <br />© 2025 Gridlife Inc.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-widest">
                Platform
              </h4>
              <ul className="space-y-2 text-gray-500 text-xs font-mono">
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    The Grid
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Squads
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-widest">
                Resources
              </h4>
              <ul className="space-y-2 text-gray-500 text-xs font-mono">
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Manifesto
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-200 mb-4 text-xs uppercase tracking-widest">
                Legal
              </h4>
              <ul className="space-y-2 text-gray-500 text-xs font-mono">
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Privacy
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-[#27272a]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-gray-500 text-[10px] font-mono uppercase">
                All Systems Operational
              </span>
            </div>
            <div className="text-gray-600 text-[10px] font-mono">
              v2.4.0-stable
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
