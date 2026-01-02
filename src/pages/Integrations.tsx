import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Github, 
  Trello, 
  CheckSquare, // Todoist Icon replacement
  Briefcase,   // Asana/Attio replacement
  Code,        // Jira replacement
  RefreshCw,
  AlertCircle,
  Settings,
  Link as LinkIcon
} from 'lucide-react';

// --- Types ---

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  category: 'dev' | 'pm' | 'crm';
  color: string; // Brand color for the icon background
}

// --- Mock Data ---

const INTEGRATIONS_LIST: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    description: 'Sync commits and PRs as completed tasks. 1 commit = 3 Impact Points.',
    status: 'connected',
    lastSync: '2 mins ago',
    category: 'dev',
    color: '#24292e'
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: Code,
    description: 'Import assigned tickets automatically. Updates status when you close issues.',
    status: 'disconnected',
    category: 'pm',
    color: '#0052CC'
  },
  {
    id: 'todoist',
    name: 'Todoist',
    icon: CheckSquare,
    description: 'Two-way sync. completing a task in Gridlife closes it in Todoist.',
    status: 'disconnected',
    category: 'pm',
    color: '#E44332'
  },
  {
    id: 'trello',
    name: 'Trello',
    icon: Trello,
    description: 'Watch specific boards. Moving cards to "Done" triggers Grid completions.',
    status: 'error',
    lastSync: 'Failed 1h ago',
    category: 'pm',
    color: '#0079BF'
  },
  {
    id: 'asana',
    name: 'Asana',
    icon: Briefcase,
    description: 'Sync "My Tasks" list. Subtasks are counted as individual micro-wins.',
    status: 'disconnected',
    category: 'pm',
    color: '#F06A6A'
  },
  {
    id: 'attio',
    name: 'Attio',
    icon: Briefcase,
    description: 'Track CRM activity. Emails and note logging count toward daily consistency.',
    status: 'disconnected',
    category: 'crm',
    color: '#000000'
  }
];

const Integrations: React.FC = () => {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS_LIST);
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleConnect = (id: string) => {
    // In a real app, this would trigger OAuth redirect or open API key modal
    setConfiguringId(id);
  };

  const confirmConnection = () => {
    if (!configuringId) return;
    
    setIntegrations(prev => prev.map(i => 
      i.id === configuringId 
        ? { ...i, status: 'connected', lastSync: 'Just now' } 
        : i
    ));
    setConfiguringId(null);
    setApiKeyInput('');
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === id 
        ? { ...i, status: 'disconnected', lastSync: undefined } 
        : i
    ));
  };

  return (
    <div className="min-h-screen bg-[#161618] text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* Navigation Bar */}
      <nav className="border-b border-[#27272a] bg-[#161618]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Grid
          </button>
          <span className="font-bold tracking-tight text-white">Integrations</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Workflow</h1>
          <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
            Stop manually logging work. Gridlife connects to your existing tools to automatically 
            capture your "Proof of Work." We listen for completion events and map them to your 
            Daily Consistency Score.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((app) => (
            <div 
              key={app.id}
              className={`
                group relative bg-[#1c1c1f] border rounded-xl p-6 transition-all duration-300
                ${app.status === 'connected' ? 'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-[#27272a] hover:border-[#3f3f46]'}
              `}
            >
              {/* App Header */}
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-inner"
                  style={{ backgroundColor: app.color }}
                >
                  <app.icon size={24} />
                </div>
                
                {/* Status Badge */}
                <div className="flex flex-col items-end">
                  {app.status === 'connected' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      SYNC ACTIVE
                    </span>
                  )}
                  {app.status === 'error' && (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
                      <AlertCircle size={10} />
                      AUTH ERROR
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
                {app.description}
              </p>

              {/* Footer Actions */}
              <div className="mt-6 pt-6 border-t border-[#27272a] flex items-center justify-between">
                {app.status === 'connected' ? (
                  <>
                    <span className="text-[10px] text-gray-600 font-mono flex items-center gap-1">
                      <RefreshCw size={10} /> {app.lastSync}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-[#27272a] rounded text-gray-400 hover:text-white transition-colors" title="Settings">
                        <Settings size={14} />
                      </button>
                      <button 
                        onClick={() => handleDisconnect(app.id)}
                        className="px-3 py-1.5 bg-[#27272a] hover:bg-red-500/10 hover:text-red-400 text-gray-300 text-xs font-bold rounded transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => handleConnect(app.id)}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    <LinkIcon size={14} /> Connect {app.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Modal (Mock) */}
        {configuringId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Configure {integrations.find(i => i.id === configuringId)?.name}</h3>
                <button onClick={() => setConfiguringId(null)} className="text-gray-500 hover:text-white">✕</button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300 leading-relaxed">
                  We need read access to your activity stream. We will never modify your data without explicit permission.
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase block mb-2">API Key / Personal Access Token</label>
                  <input 
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <button 
                  onClick={confirmConnection}
                  disabled={!apiKeyInput}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm transition-all"
                >
                  Authorize Connection
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Integrations;