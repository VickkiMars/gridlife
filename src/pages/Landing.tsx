import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Activity,
  Cpu,
  Grid,
  Share2,
  Zap,
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
              <a className="hover:text-blue-400 transition-colors" href="#">
                Engine
              </a>
              <a className="hover:text-blue-400 transition-colors" href="#">
                Protocol
              </a>
              <a className="hover:text-blue-400 transition-colors" href="#">
                Manifesto
              </a>
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
                Init Sequence
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
            System V2.0 Online
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 pb-2">
            The kinetic theory <br />
            of <span className="text-[#3b82f6]">productivity</span>.
          </h1>

          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            Stop guessing where the time goes. Visualize workflow entropy,
            detect velocity bottlenecks, and optimize your output vectors with
            precision.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => navigate("/create")}
              className="bg-[#3b82f6] text-white h-12 px-8 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2 group"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-transparent border border-[#3f3f46] text-gray-300 h-12 px-8 rounded-lg font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>System Demo</span>
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
                      Output Velocity
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
                  Efficiency
                </span>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  98.2<span className="text-gray-600 text-lg">%</span>
                </div>
                <div className="text-[10px] text-blue-400 flex items-center mt-1 font-mono">
                  ▲ OPTIMIZED
                </div>
              </div>

              {/* Metric Card 2 */}
              <div className="col-span-1 row-span-1 bg-[#161618] p-6 flex flex-col justify-between hover:bg-[#1c1c1f] transition-colors border-l border-[#27272a]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  Deep Work
                </span>
                <div className="text-3xl font-bold text-white mt-2 font-mono">
                  6.4<span className="text-gray-600 text-lg">h</span>
                </div>
                <div className="w-full bg-[#27272a] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full w-[85%] shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                </div>
              </div>

              {/* Bottom Wide Card */}
              <div className="col-span-2 row-span-1 bg-[#161618] p-6 flex items-center justify-between hover:bg-[#1c1c1f] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-200 text-sm">
                      Cognitive Load
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">
                      Within sustainable limits
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Card */}
              <div className="col-span-2 row-span-1 bg-[#09090b] p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase text-gray-500">
                    Sync Stream Active
                  </span>
                </div>
                <div className="font-mono text-[10px] text-gray-500 space-y-1.5">
                  <p>
                    <span className="text-blue-500">➜</span>{" "}
                    fetching_vectors(source: "local")
                  </p>
                  <p>
                    <span className="text-blue-500">➜</span>{" "}
                    encrypting_payload...
                  </p>
                  <p className="text-emerald-500">➜ sync_complete [12ms]</p>
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
              System Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Engineered for High-Velocity Output
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Feature 1: Spectral Heatmaps */}
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
                    Visualize workflow intensity across time. Identify burnout
                    risks with color-coded gradients mapped to your activity
                    output.
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

            {/* Feature 2: Cross-Silo */}
            <div className="rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group p-8 hover:border-[#3f3f46] transition-colors">
              <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                <Share2 className="text-gray-200 w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">
                Encrypted Sync
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your data is sharded, encrypted, and synced across devices with
                zero-knowledge architecture.
              </p>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded bg-[#27272a] border border-[#3f3f46] text-[10px] font-mono text-gray-400">
                  AES-256
                </div>
                <div className="px-3 py-1 rounded bg-[#27272a] border border-[#3f3f46] text-[10px] font-mono text-gray-400">
                  E2EE
                </div>
              </div>
            </div>

            {/* Feature 3: Latency */}
            <div className="rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group p-8 hover:border-[#3f3f46] transition-colors">
              <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                <Zap className="text-gray-200 w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-white">
                Anomaly Detection
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Algorithmic detection of productivity dips and variance from
                your historical baseline.
              </p>
              <div className="mt-6 p-3 bg-red-500/5 border border-red-500/20 rounded flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] text-red-400 font-mono uppercase">
                  Variance Detected: -14% Output
                </span>
              </div>
            </div>

            {/* Feature 4: Forecasting */}
            <div className="md:col-span-2 rounded-xl border border-[#27272a] bg-[#1c1c1f] overflow-hidden relative group hover:border-[#3f3f46] transition-colors">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#09090b] to-transparent pointer-events-none" />
              <div className="p-8 h-full flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center mb-6 border border-[#3f3f46]">
                    <BarChart3 className="text-gray-200 w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white">
                    Predictive Modeling
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Our engine simulates future workflow states based on current
                    velocity vectors to predict project completion.
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-[#09090b] rounded border border-[#27272a] p-4 shadow-inner">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase mb-4">
                      <span>Projected</span>
                      <span>Q4 2025</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      <div className="flex-1 bg-[#27272a] rounded-t-sm h-[40%]" />
                      <div className="flex-1 bg-[#27272a] rounded-t-sm h-[60%]" />
                      <div className="flex-1 bg-[#27272a] rounded-t-sm h-[55%]" />
                      {/* Prediction Bar */}
                      <div className="flex-1 bg-blue-500/10 rounded-t-sm h-[75%] border-t border-blue-500 border-dashed relative">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-blue-500 text-[9px] font-mono">
                          EST
                        </div>
                      </div>
                      <div className="flex-1 bg-blue-500/10 rounded-t-sm h-[85%] border-t border-blue-500 border-dashed" />
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
                    Integrate with local environments via CLI.
                  </p>
                </button>
                <button className="w-full text-left p-4 rounded hover:bg-[#161618] border-l-2 border-transparent transition-all opacity-60 hover:opacity-100">
                  <h4 className="font-bold text-gray-200 text-sm font-mono uppercase">
                    Product Managers
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Visualize team entropy and blockers.
                  </p>
                </button>
                <button className="w-full text-left p-4 rounded hover:bg-[#161618] border-l-2 border-transparent transition-all opacity-60 hover:opacity-100">
                  <h4 className="font-bold text-gray-200 text-sm font-mono uppercase">
                    Quant Traders
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Track decision fatigue against market hours.
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
                    kinetics-cli — v2.4.0
                  </div>
                </div>
                <div className="space-y-2 text-gray-400">
                  <p>$ kinetics analyze --range=ytd --output=json</p>
                  <p className="text-blue-500">
                    ➜ Initializing Analysis Engine...
                  </p>
                  <p>➜ Loading 14,204 vectors from local_db</p>
                  <p>➜ Calculating velocity...</p>
                  <br />
                  <p className="text-emerald-500">✔ REPORT GENERATED [0.4s]</p>
                  <div className="pl-4 border-l border-[#27272a] text-xs space-y-1 mt-2">
                    <p>
                      Total_Focus: <span className="text-white">1,240h</span>
                    </p>
                    <p>
                      Peak_Flow:{" "}
                      <span className="text-white">09:00 - 11:30</span>
                    </p>
                    <p>
                      Efficiency_Score:{" "}
                      <span className="text-blue-400">98.4/100</span>
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
            <button className="bg-white text-black h-14 px-8 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-all">
              Initialize Free Tier
            </button>
            <button className="bg-transparent border border-[#27272a] text-gray-300 h-14 px-8 rounded-lg font-bold text-sm uppercase tracking-wide hover:bg-[#27272a] transition-all">
              Read Documentation
            </button>
          </div>

          <div className="mt-16 pt-12 border-t border-[#27272a] grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">1B+</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Vectors Processed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">0ms</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Local Latency
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">42%</div>
              <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Efficiency Gain
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
                    Core Engine
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-500 transition-colors" href="#">
                    API Access
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
