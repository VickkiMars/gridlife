import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ShieldAlert, Zap, Brain } from 'lucide-react';

const Method: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#161618] text-gray-200 font-sans selection:bg-blue-500/30">
      <nav className="border-b border-[#27272a] bg-[#161618]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Grid
          </button>
          <span className="font-bold tracking-tight text-white">Protocol V2.4</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-24">
        <header className="mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-6">
            <Brain size={12} />
            The Psychology
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            We engineered <br />
            <span className="text-blue-500">social loss aversion</span>.
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            Willpower is a finite resource. Social pressure is infinite. 
            The Gridlife Protocol leverages the fear of letting the tribe down to override individual procrastination.
          </p>
        </header>

        <section className="space-y-24">
          {/* Principle 1 */}
          <div className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center text-blue-500">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">The Squad Lock</h2>
            </div>
            <div className="pl-4 border-l-2 border-[#27272a] group-hover:border-blue-500/50 transition-colors duration-500">
              <p className="text-gray-400 mb-4">
                In a standard habit tracker, if you miss a day, only you know. In a Squad, 
                your failure breaks the grid for everyone. This is <strong>Social Loss Aversion</strong>. 
                The psychological pain of destroying the group's streak is 2.5x more powerful than the dopamine of a personal win.
              </p>
              <div className="bg-[#09090b] p-4 rounded border border-[#27272a] font-mono text-xs text-gray-500">
                <span className="text-blue-400">const</span> squad_state = members.every(m =&gt; m.complete) ? <span className="text-emerald-400">'ACTIVE'</span> : <span className="text-red-400">'BROKEN'</span>;
              </div>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center text-blue-500">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">The Whale Clause</h2>
            </div>
            <div className="pl-4 border-l-2 border-[#27272a] group-hover:border-blue-500/50 transition-colors duration-500">
              <p className="text-gray-400 mb-4">
                Life happens. To prevent a single failure from demoralizing the team, we implemented the <strong>Whale Clause</strong>. 
                If one member performs at 300% capacity (a "Legendary" day), they can mathematically "carry" one missing member. 
                This gamifies high-performance: you aren't just working for yourself, you are saving the team.
              </p>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded bg-[#1c1c1f] border border-[#27272a] flex items-center justify-center text-blue-500">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Variance & Burnout</h2>
            </div>
            <div className="pl-4 border-l-2 border-[#27272a] group-hover:border-blue-500/50 transition-colors duration-500">
              <p className="text-gray-400 mb-4">
                Consistency is not monotony. Our algorithm tracks the variance of your output intensity. 
                <strong>High Volume + Low Variance = Burnout Risk.</strong>
                If you grind at 100% capacity for 7 days straight, the system will force a "Rest State" 
                to preserve long-term velocity.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-24 pt-12 border-t border-[#27272a] text-center">
          <p className="text-gray-500 mb-6">Ready to apply the protocol?</p>
          <button 
            onClick={() => navigate('/create')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Initialize Grid
          </button>
        </div>
      </main>
    </div>
  );
};

export default Method;