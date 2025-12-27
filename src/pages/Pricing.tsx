import React, { useState } from 'react';
import { Check, X, Zap, Shield, Database, Smartphone } from 'lucide-react';
import { COLORS } from '../types/index';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div 
      className="min-h-screen p-6 flex flex-col items-center justify-center font-sans text-gray-100"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-xs font-mono text-blue-500 uppercase tracking-widest mb-4">Upgrade your output</h2>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Price of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Productivity</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Gridlife is free to use forever locally. Upgrade for cloud synchronization, 
          unlimited history, and advanced outlier analytics.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-4 mb-12 bg-black/20 p-1.5 rounded-lg border border-white/5">
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
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        {/* FREE PLAN */}
        <div 
          className="rounded-2xl p-8 border relative flex flex-col"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-100 mb-2">Local / Core</h3>
            <p className="text-sm text-gray-500 h-10">Essential tracking for the disciplined individual.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500 text-sm">/forever</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <FeatureItem text="Local Browser Storage" icon={<Database size={16} />} />
            <FeatureItem text="Monthly Heatmap View" />
            <FeatureItem text="Basic Task Analytics" />
            <FeatureItem text="Manual JSON Export/Import" />
            <FeatureItem text="7-Day Timeline History" disabled />
            <FeatureItem text="Cloud Sync" disabled />
          </div>

          <button className="w-full py-3 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors">
            Current Plan
          </button>
        </div>

        {/* PRO PLAN */}
        <div 
          className="rounded-2xl p-8 border relative flex flex-col shadow-2xl"
          style={{ 
            backgroundColor: 'rgba(22, 22, 24, 0.8)', 
            borderColor: 'rgba(59, 130, 246, 0.3)',
            boxShadow: '0 0 40px -10px rgba(59, 130, 246, 0.15)'
          }}
        >
          {/* Badge */}
          <div className="absolute -top-3 left-8 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-500/40">
            Recommended
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Gridlife Pro</h3>
              <Zap size={20} className="text-blue-400 fill-blue-400/20" />
            </div>
            <p className="text-sm text-gray-400 h-10">For those obsessed with optimization and data longevity.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">
                ${billingCycle === 'monthly' ? '9' : '7'}
              </span>
              <span className="text-gray-500 text-sm">/mo</span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-xs text-blue-400 mt-1">Billed $84 yearly</p>
            )}
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <FeatureItem 
              text="End-to-End Encrypted Sync" 
              highlight 
              icon={<Shield size={16} className="text-blue-400" />} 
            />
            <FeatureItem 
              text="Mobile App Access (iOS/Android)" 
              highlight 
              icon={<Smartphone size={16} className="text-blue-400" />} 
            />
            <FeatureItem text="Unlimited History Retention" highlight />
            <FeatureItem text="Advanced Year-Over-Year Trends" highlight />
            <FeatureItem text="Custom Tags & Categories" highlight />
            <FeatureItem text="Automated Daily Backups" highlight />
          </div>

          <button 
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.primary}, #6366f1)`,
              boxShadow: '0 4px 20px -5px rgba(59, 130, 246, 0.5)'
            }}
          >
            Unlock Pro Access
          </button>
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
    {icon && <div className="ml-auto">{icon}</div>}
  </div>
);

export default Pricing;