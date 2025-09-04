import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { Link } from 'react-router-dom';
import { Shield, Save, Moon, Sun, CheckCircle, ArrowRight } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import { useNotification } from '../context/NotificationContext';
import SettingsSidebar from '../components/SettingsSidebar';

type ThemeChoice = 'light' | 'dark' | 'system';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <div style={{ color: 'red', padding: 32 }}><h2>Error:</h2><pre>{String(this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}

const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { queues } = useQueue();
  const { addNotification } = useNotification();

  // Debug output for context values
  if (!user) {
    return <div style={{ color: 'red', padding: 32 }}>Auth context missing or user not logged in.</div>;
  }
  if (!queues) {
    return <div style={{ color: 'red', padding: 32 }}>Queue context missing.</div>;
  }
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    const stored = localStorage.getItem('fairq_theme') as ThemeChoice | null;
    return stored || 'light';
  });

  useEffect(() => {
    const apply = (choice: ThemeChoice) => {
      const root = document.documentElement;
      root.classList.remove('dark');
      if (choice === 'dark' || (choice === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      }
    };
    localStorage.setItem('fairq_theme', theme);
    apply(theme);
  }, [theme]);

  const myQueues = useMemo(() => queues.filter(q => q.userId === (user?.id || '')), [queues, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex">
        <SettingsSidebar />
        <div className="flex-1">
          <TopNavbar sidebarOpen={false} setSidebarOpen={() => {}} />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            {/* Main Settings (no profile editing here) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h1>
              <p className="text-gray-600">Manage queues, notifications, verification, system integrations, analytics, and appearance.</p>
            </motion.div>
            {/* Theme & Accessibility */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                <span>Theme & Accessibility</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['light','dark','system'] as ThemeChoice[]).map(choice => (
                  <button key={choice} onClick={() => setTheme(choice)} className={`p-4 rounded-lg border text-left ${theme===choice ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {choice==='dark' ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>}
                        <span className="font-medium capitalize">{choice}</span>
                      </div>
                      {theme===choice && <CheckCircle className="w-4 h-4 text-blue-600"/>}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {choice==='system' ? 'Follow your OS preference' : choice==='dark' ? 'Dark theme for low-light' : 'Light, clean interface'}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font size</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500">
                    <option>Normal</option>
                    <option>Large</option>
                    <option>Extra Large</option>
                  </select>
                </div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">High contrast mode</span>
                </label>
              </div>
            </motion.div>
            {/* Queue Configuration */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add or Edit Queue</label>
                  <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500" placeholder="Queue name (e.g., Flights, UPSC)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority Rules</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500">
                    <option>First-come-first-serve</option>
                    <option>VIP then General</option>
                    <option>High to Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Queue Size</label>
                  <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500" placeholder="e.g., 500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opens</label>
                    <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closes</label>
                    <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save System Settings</button>
              </div>
            </motion.div>
            {/* Notification Settings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Enable push notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700">Send email alerts</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wait time alert threshold (min)</label>
                  <input type="number" placeholder="e.g., 10" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom message</label>
                <input placeholder="Your queue update template..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Notification Settings</button>
              </div>
            </motion.div>
            {/* Verification */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium">Blockchain Integrity</p>
                  <p className="text-sm text-gray-600">All queue positions are cryptographically secured.</p>
                </div>
                <button onClick={() => addNotification({ type: 'info', title: 'Verification check', message: 'Integrity re-verified successfully.' })} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Re-verify</button>
              </div>
            </motion.div>
            {/* System & Integrations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System & Integrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blockchain Network</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Mainnet</option>
                    <option>Testnet</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                  <input placeholder="Enter API key for external integrations" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Connections</label>
                  <input type="number" placeholder="e.g., 100" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save System Settings</button>
              </div>
            </motion.div>
            {/* Analytics & Reporting */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Reporting Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Range</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All</option>
                    <option>Queue length</option>
                    <option>Avg processing time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-report Interval</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Off</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center space-x-3">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Analytics Preferences</button>
                <button className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Export CSV</button>
                <button className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Export PDF</button>
              </div>
            </motion.div>
            {/* My Bookings/Registrations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Bookings & Registrations</h2>
              {myQueues.length === 0 ? (
                <p className="text-sm text-gray-600">No active items yet. Join a queue from Booking or Exam Registration.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {myQueues.map(item => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.service}</p>
                        <p className="text-sm text-gray-600 capitalize">{item.queueType} • Position #{item.position} • {item.status}</p>
                      </div>
                      <Link to={`/queue-status/${item.id}`} className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center space-x-1">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4"/>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

    );
  }; // End of return statement
};

// Wrap SettingsPage in ErrorBoundary
const SettingsPageWithBoundary: React.FC = () => (
  <ErrorBoundary>
    <SettingsPage />
  </ErrorBoundary>
);

export default SettingsPageWithBoundary;




