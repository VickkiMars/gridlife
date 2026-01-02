import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Zap, Shield, Database, Github, Users, History, Eye, ArrowLeft } from 'lucide-react';
import { COLORS } from '../types/index';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div 
      className="min-h-screen p-6 flex flex-col items-center font-sans text-gray-100"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Navigation */}
      <nav className="w-full max-w-6xl mx-auto mb-16 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Grid
        </button>
      </nav>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-4">Select your protocol</h2>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Price of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Consistency</span>
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Gridlife is free to use forever locally. Upgrade for automated velocity, 
          deeper insights, and squad leadership capabilities.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-4 mb-12 bg-black/20 p-1.5 rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            billingCycle === 'monthly' 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            billingCycle === 'yearly' 
              ? 'bg-zinc-800 text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Yearly <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">-20%</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        
        {/* FREE PLAN (Initiate) */}
        <div 
          className="rounded-2xl p-8 border relative flex flex-col group hover:border-zinc-700 transition-colors"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-100 mb-2 font-mono uppercase tracking-widest">Initiate</h3>
            <p className="text-sm text-gray-500 h-10">Essential tracking for the disciplined individual.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500 text-sm">/forever</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <FeatureItem text="Local Browser Storage" icon={<Database size={14} />} />
            <FeatureItem text="Standard Heatmap" />
            <FeatureItem text="90-Day History" />
            <FeatureItem text="Manual JSON Export" />
            <FeatureItem text="Join Squads" icon={<Users size={14} />} />
            
            <div className="pt-4 border-t border-white/5 space-y-4">
              <FeatureItem text="Integrity (Shadow) View" disabled icon={<Eye size={14} />} />
              <FeatureItem text="Auto-Sync (GitHub/Jira)" disabled icon={<Github size={14} />} />
              <FeatureItem text="Create Squads" disabled />
            </div>
          </div>

          <button className="w-full py-3 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors">
            Current Plan
          </button>
        </div>

        {/* PRO PLAN (Operator) */}
        <div 
          className="rounded-2xl border relative flex flex-col shadow-2xl"
          style={{ 
            backgroundColor: 'rgba(22, 22, 24, 0.8)', 
            borderColor: 'rgba(59, 130, 246, 0.3)',
            boxShadow: '0 0 40px -10px rgba(59, 130, 246, 0.15)'
          }}
        >
          {/* Badge - Positioned absolute relative to container, High Z-Index to sit on top of border */}
          <div className="absolute -top-3 left-8 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/40 z-50">
            High Velocity
          </div>
          
          {/* Subtle Glow Background - Low Z-Index */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none z-0" />

          {/* Header Content */}
          <div className="mb-8 p-8 pb-0 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white font-mono uppercase tracking-widest">Operator</h3>
              <Zap size={20} className="text-blue-400 fill-blue-400/20" />
            </div>
            <p className="text-sm text-gray-400 h-10">For those obsessed with optimization and data longevity.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">
                ${billingCycle === 'monthly' ? '12' : '9'}
              </span>
              <span className="text-gray-500 text-sm">/mo</span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-xs text-blue-400 mt-1">Billed $108 yearly</p>
            )}
          </div>

          {/* Feature List */}
          <div className="space-y-4 mb-8 flex-1 relative z-10 px-8">
            <FeatureItem 
              text="Integrity (Shadow) View" 
              highlight 
              icon={<Eye size={14} className="text-blue-400" />} 
            />
            <FeatureItem 
              text="Auto-Sync (GitHub, Jira, Linear)" 
              highlight 
              icon={<Github size={14} className="text-blue-400" />} 
            />
            <FeatureItem 
              text="Create & Lead Squads" 
              highlight 
              icon={<Users size={14} className="text-blue-400" />} 
            />
            <FeatureItem 
              text="Infinite History Retention" 
              highlight 
              icon={<History size={14} className="text-blue-400" />} 
            />
            <FeatureItem text="Proof of Work Export" highlight />
            <FeatureItem text="Cloud Sync & Backup" highlight icon={<Shield size={14} className="text-blue-400" />} />
          </div>

          {/* Action Button */}
          <div className="p-8 pt-0 relative z-10">
            <button 
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.primary}, #6366f1)`,
                boxShadow: '0 4px 20px -5px rgba(59, 130, 246, 0.5)'
              }}
            >
              Upgrade to Operator
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-gray-600 text-xs font-mono">
        Prices in USD. Cancel anytime. 14-day money-back guarantee.
      </p>
    </div>
  );
};

// Sub-component for clean list items
const FeatureItem = ({ text, disabled = false, highlight = false, icon }: { text: string, disabled?: boolean, highlight?: boolean, icon?: React.ReactNode }) => (
  <div className={`flex items-center gap-3 ${disabled ? 'opacity-40' : 'opacity-100'}`}>
    <div className={`
      w-5 h-5 rounded-full flex items-center justify-center shrink-0
      ${highlight ? 'bg-blue-500/20 text-blue-400' : disabled ? 'bg-white/5 text-gray-500' : 'bg-zinc-800 text-gray-300'}
    `}>
      {disabled ? <X size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
    </div>
    <span className={`text-sm ${highlight ? 'text-gray-100 font-medium' : 'text-gray-400'}`}>
      {text}
    </span>
    {icon && <div className="ml-auto text-gray-500">{icon}</div>}
  </div>
);

export default Pricing;