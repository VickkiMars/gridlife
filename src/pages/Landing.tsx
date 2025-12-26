import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import { 
  Layers, 
  ArrowRight, 
  PlayCircle, 
  TrendingUp, 
  Brain, 
  Grid, 
  Network, 
  Zap, 
  AlertTriangle, 
  LineChart 
} from 'lucide-react';

/**
 * Landing Component
 * Modified to include programmatic routing to /create
 */
const Landing: React.FC = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // CSS Mask styles for the grid overlay
  const gridOverlayStyle: React.CSSProperties = {
    maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
  };

  const gridPatternLight = 'linear-gradient(to right, #E5E5E5 1px, transparent 1px), linear-gradient(to bottom, #E5E5E5 1px, transparent 1px)';
  const gridPatternDark = 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)';

  return (
    <div className="bg-[#F7F7F7] dark:bg-[#0A0A0A] text-[#171717] dark:text-[#EDEDED] font-sans antialiased transition-colors duration-300 min-h-screen">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 rounded-md flex items-center justify-center">
                <Layers className="text-white dark:text-black w-5 h-5" />
              </div>
              <span className="font-semibold text-lg tracking-tight">FocusMetrics</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#666666] dark:text-[#A1A1A1]">
              <a className="hover:text-[#171717] dark:hover:text-[#EDEDED] transition-colors" href="#">Product</a>
              <a className="hover:text-[#171717] dark:hover:text-[#EDEDED] transition-colors" href="#">Solutions</a>
              <a className="hover:text-[#171717] dark:hover:text-[#EDEDED] transition-colors" href="#">Enterprise</a>
              <a className="hover:text-[#171717] dark:hover:text-[#EDEDED] transition-colors" href="#">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <a className="text-sm font-medium text-[#666666] dark:text-[#A1A1A1] hover:text-[#171717] dark:hover:text-[#EDEDED] hidden sm:block" href="#">Log in</a>
              <a className="bg-[#FF4F00] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-opacity-90 transition-opacity" href="#">Request Demo</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Dynamic Grid Background Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-[length:40px_40px] opacity-[0.4] pointer-events-none"
          style={gridOverlayStyle}
        >
          <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: gridPatternLight }} />
          <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: gridPatternDark }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-800 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 pb-2">
            See the heat behind<br />every heartbeat of work.
          </h1>
          <p className="mt-4 text-xl text-[#666666] dark:text-[#A1A1A1] max-w-2xl mx-auto leading-relaxed">
            Transform raw task completion data into actionable visual heatmaps. 
            Identify bottlenecks, optimize flow, and empower your teams with precision analytics.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            {/* MODIFIED BUTTON: Changed text and added navigate to /create */}
            <button 
              onClick={() => navigate('/create')}
              className="bg-[#FF4F00] text-white h-12 px-8 rounded-full font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-[#171717] dark:text-[#EDEDED] h-12 px-8 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Visualization Dashboard Component */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 dark:opacity-30" />
            <div className="relative bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-xl shadow-2xl overflow-hidden aspect-[16/9] grid grid-cols-4 grid-rows-3 gap-px bg-[#E5E5E5] dark:bg-[#262626]">
              
              <div className="col-span-3 row-span-2 bg-white dark:bg-black p-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10" />
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-[#666666] dark:text-[#A1A1A1] uppercase tracking-wider">Real-time Velocity</span>
                  </div>
                  <div className="h-6 w-20 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
                </div>
                
                <div className="w-full h-48 flex items-end justify-between gap-1">
                  <div className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 h-[30%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 h-[50%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 h-[45%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-yellow-500/20 to-yellow-400 h-[70%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-orange-500/20 to-orange-400 h-[85%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-red-500/20 to-red-500 h-[95%] rounded-t-sm relative shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  <div className="w-full bg-gradient-to-t from-orange-500/20 to-orange-400 h-[60%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 h-[40%] rounded-t-sm" />
                  <div className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400 h-[35%] rounded-t-sm" />
                </div>
                <div className="mt-4 flex justify-between text-xs font-mono text-[#666666] dark:text-[#A1A1A1]">
                  <span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span>
                </div>
              </div>

              <div className="col-span-1 row-span-1 bg-white dark:bg-black p-6 flex flex-col justify-between group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <span className="text-xs font-mono text-[#666666] dark:text-[#A1A1A1] uppercase">Efficiency Score</span>
                <div className="text-3xl font-bold text-[#171717] dark:text-[#EDEDED] mt-2">94.2%</div>
                <div className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" /> +2.4%
                </div>
              </div>

              <div className="col-span-1 row-span-1 bg-white dark:bg-black p-6 flex flex-col justify-between group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <span className="text-xs font-mono text-[#666666] dark:text-[#A1A1A1] uppercase">Focus Blocks</span>
                <div className="text-3xl font-bold text-[#171717] dark:text-[#EDEDED] mt-2">1,240</div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#FF4F00] h-full w-[70%]" />
                </div>
              </div>

              <div className="col-span-2 row-span-1 bg-white dark:bg-black p-6 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#171717] dark:text-[#EDEDED]">Deep Work Ratio</div>
                    <div className="text-xs text-[#666666] dark:text-[#A1A1A1]">Sustainable pace maintained</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">4.5h</div>
                  <div className="text-xs text-[#666666] dark:text-[#A1A1A1]">Daily Avg</div>
                </div>
              </div>

              <div className="col-span-2 row-span-1 bg-white dark:bg-black p-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
                  <span className="text-xs font-mono uppercase text-[#666666] dark:text-[#A1A1A1]">Integration Active</span>
                </div>
                <div className="font-mono text-xs text-[#666666] dark:text-[#A1A1A1] space-y-1 opacity-70">
                  <p>&gt; fetching_data_stream(source: "jira")</p>
                  <p>&gt; processing_vectors...</p>
                  <p className="text-green-500">&gt; visualization_ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Analysis Section */}
      <section className="py-24 bg-[#F7F7F7] dark:bg-[#0A0A0A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-mono text-[#FF4F00] tracking-wider uppercase mb-2">Granular Visibility</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#171717] dark:text-[#EDEDED]">Engineered for Data Teams</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            <div className="md:col-span-2 rounded-2xl border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#141414] overflow-hidden relative group">
              <div className="p-8 h-full flex flex-col z-10 relative">
                <div className="mb-auto">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <Grid className="text-[#171717] dark:text-[#EDEDED] w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-[#171717] dark:text-[#EDEDED]">Spectral Heatmaps</h4>
                  <p className="text-[#666666] dark:text-[#A1A1A1] max-w-md">Visualize workflow intensity with our proprietary spectral gradients. Instantly spot burnout risks and idle resources with color-coded precision.</p>
                </div>
                <div className="mt-8 w-full h-48 bg-gray-50 dark:bg-black rounded-lg border border-[#E5E5E5] dark:border-[#262626] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,79,0,0.2),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF4F00] to-transparent opacity-50" />
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-y divide-gray-200/10 dark:divide-gray-800/50">
                    {Array.from({ length: 24 }).map((_, i) => <div key={i} />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#141414] overflow-hidden relative group p-8">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <Network className="text-[#171717] dark:text-[#EDEDED] w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-[#171717] dark:text-[#EDEDED]">Cross-Silo Analysis</h4>
              <p className="text-[#666666] dark:text-[#A1A1A1] text-sm leading-relaxed">Connect Jira, GitHub, and Slack data into a unified productivity layer. Break down the walls between departments.</p>
              <div className="mt-8 flex -space-x-4 overflow-hidden py-2 pl-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white dark:border-black flex items-center justify-center text-white text-xs font-bold">J</div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-white text-xs font-bold">G</div>
                <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-white dark:border-black flex items-center justify-center text-white text-xs font-bold">S</div>
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-black flex items-center justify-center text-gray-500 text-xs font-bold">+5</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#141414] overflow-hidden relative group p-8">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <Zap className="text-[#171717] dark:text-[#EDEDED] w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-[#171717] dark:text-[#EDEDED]">Latency Detection</h4>
              <p className="text-[#666666] dark:text-[#A1A1A1] text-sm leading-relaxed">AI-driven anomaly detection highlights when task completion times deviate from the historic baseline.</p>
              <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded flex items-center gap-3">
                <AlertTriangle className="text-red-500 w-4 h-4" />
                <span className="text-xs text-red-600 dark:text-red-400 font-mono">Anomaly: +450ms lag in deploy pipeline</span>
              </div>
            </div>

            <div className="md:col-span-2 rounded-2xl border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#141414] overflow-hidden relative group">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
              <div className="p-8 h-full flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                    <LineChart className="text-[#171717] dark:text-[#EDEDED] w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-[#171717] dark:text-[#EDEDED]">Predictive Forecasting</h4>
                  <p className="text-[#666666] dark:text-[#A1A1A1]">Use historical heatmaps to predict future bottlenecks before they happen. Our engine simulates thousands of scenarios per second.</p>
                  <a className="inline-flex items-center mt-6 text-[#FF4F00] font-medium hover:underline" href="#">
                    Explore Forecasting 
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-white dark:bg-black rounded-lg border border-[#E5E5E5] dark:border-[#262626] p-4 shadow-sm">
                    <div className="flex justify-between text-xs text-[#666666] dark:text-[#A1A1A1] mb-4">
                      <span>Projected Output</span>
                      <span>Q3 2024</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-t h-[40%]" />
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-t h-[60%]" />
                      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-t h-[55%]" />
                      <div className="flex-1 bg-[#FF4F00]/20 rounded-t h-[75%] border-t-2 border-[#FF4F00] border-dashed relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF4F00] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Predicted</div>
                      </div>
                      <div className="flex-1 bg-[#FF4F00]/20 rounded-t h-[85%] border-t-2 border-[#FF4F00] border-dashed" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Interaction */}
      <section className="py-24 border-t border-[#E5E5E5] dark:border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-bold mb-6 text-[#171717] dark:text-[#EDEDED]">Built for those who manage scale.</h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-l-4 border-[#FF4F00] transition-all">
                  <h4 className="font-semibold text-[#171717] dark:text-[#EDEDED]">Productivity Managers</h4>
                  <p className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">Balance workloads and prevent team burnout with visual capacity planning.</p>
                </button>
                <button className="w-full text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 border-l-4 border-transparent transition-all opacity-60 hover:opacity-100">
                  <h4 className="font-semibold text-[#171717] dark:text-[#EDEDED]">Data Science Teams</h4>
                  <p className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">Export raw vector data via API for custom modeling and internal reporting.</p>
                </button>
                <button className="w-full text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 border-l-4 border-transparent transition-all opacity-60 hover:opacity-100">
                  <h4 className="font-semibold text-[#171717] dark:text-[#EDEDED]">CTOs &amp; VPs of Engineering</h4>
                  <p className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">High-level dashboards connecting development velocity to business outcomes.</p>
                </button>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="h-full bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF4F00]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8 border-b border-[#E5E5E5] dark:border-[#262626] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="text-sm font-medium text-[#171717] dark:text-[#EDEDED]">Engineering Team Alpha</div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Last 30 Days</span>
                      <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Export CSV</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#666666] dark:text-[#A1A1A1]">Burnout Risk Index</span>
                        <span className="text-red-500 font-bold">High (82%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 w-[82%]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-black rounded-lg border border-[#E5E5E5] dark:border-[#262626]">
                        <div className="text-xs text-[#666666] dark:text-[#A1A1A1] uppercase mb-1">Avg Task Cycle Time</div>
                        <div className="text-2xl font-bold text-[#171717] dark:text-[#EDEDED]">4.2 Days</div>
                        <div className="text-xs text-green-500 mt-1">-12% vs last month</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-black rounded-lg border border-[#E5E5E5] dark:border-[#262626]">
                        <div className="text-xs text-[#666666] dark:text-[#A1A1A1] uppercase mb-1">Context Switching Costs</div>
                        <div className="text-2xl font-bold text-[#171717] dark:text-[#EDEDED]">$12,400</div>
                        <div className="text-xs text-red-500 mt-1">+5% vs last month</div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="text-xs text-[#666666] dark:text-[#A1A1A1]">Workload Distribution</div>
                      <div className="grid grid-cols-12 gap-1 h-8">
                        {['10','20','40','60','80','','90','50','30','20','10','5'].map((op, idx) => (
                          <div key={idx} className={`bg-[#FF4F00]${op ? '/'+op : ''} rounded-sm`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-12 gap-1 h-8">
                        {['5','10','20','30','40','60','50','30','20','10','5','0'].map((op, idx) => (
                          <div key={idx} className={`bg-[#FF4F00]${op === '0' ? '/0' : '/'+op} rounded-sm`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#141414]">
          <div className="absolute inset-0 bg-[length:32px_32px] opacity-[0.2]" style={{ backgroundImage: gridPatternLight }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4F00]/20 blur-[120px] rounded-full pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-[#171717] dark:text-[#EDEDED]">Ready to optimize your flow?</h2>
          <p className="text-xl text-[#666666] dark:text-[#A1A1A1] mb-10">
            Join forward-thinking teams using FocusMetrics to visualize their productivity DNA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#FF4F00] text-white h-14 px-8 rounded-full font-medium text-lg hover:shadow-lg hover:shadow-[#FF4F00]/40 transition-all">
              Request a Demo
            </button>
            <button className="bg-transparent border border-[#E5E5E5] dark:border-[#262626] text-[#171717] dark:text-[#EDEDED] h-14 px-8 rounded-full font-medium text-lg hover:bg-[#FFFFFF] dark:hover:bg-white/5 transition-all">
              Contact Sales
            </button>
          </div>

          <div className="mt-12 pt-12 border-t border-[#E5E5E5] dark:border-[#262626] grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#171717] dark:text-[#EDEDED]">10k+</div>
              <div className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">Teams Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#171717] dark:text-[#EDEDED]">2.5M</div>
              <div className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">Tasks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#171717] dark:text-[#EDEDED]">24%</div>
              <div className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">Avg Efficiency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#171717] dark:text-[#EDEDED]">99.9%</div>
              <div className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-1">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F7F7F7] dark:bg-[#0A0A0A] border-t border-[#E5E5E5] dark:border-[#262626] py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
                  <Layers className="text-white dark:text-black w-3 h-3" />
                </div>
                <span className="font-bold text-[#171717] dark:text-[#EDEDED]">FocusMetrics</span>
              </div>
              <p className="text-[#666666] dark:text-[#A1A1A1]">
                San Francisco, CA<br />
                © 2024 FocusMetrics Inc.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#171717] dark:text-[#EDEDED] mb-4">Product</h4>
              <ul className="space-y-2 text-[#666666] dark:text-[#A1A1A1]">
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Integrations</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Enterprise</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#171717] dark:text-[#EDEDED] mb-4">Resources</h4>
              <ul className="space-y-2 text-[#666666] dark:text-[#A1A1A1]">
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">API Reference</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#171717] dark:text-[#EDEDED] mb-4">Legal</h4>
              <ul className="space-y-2 text-[#666666] dark:text-[#A1A1A1]">
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-[#FF4F00] transition-colors" href="#">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E5E5E5] dark:border-[#262626]">
            <div className="flex gap-4">
              <a className="text-[#666666] dark:text-[#A1A1A1] hover:text-[#FF4F00] transition-colors" href="#">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a className="text-[#666666] dark:text-[#A1A1A1] hover:text-[#FF4F00] transition-colors" href="#">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
              </a>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[#666666] dark:text-[#A1A1A1] text-xs">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;