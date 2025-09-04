import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Save } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import MainLayout from '../components/MainLayout';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ProfileSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotification();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(localStorage.getItem('fairq_phone') || '');
  const [emailNotif, setEmailNotif] = useState(localStorage.getItem('fairq_pref_email') === '1');
  const [smsNotif, setSmsNotif] = useState(localStorage.getItem('fairq_pref_sms') === '1');
  const [pushNotif, setPushNotif] = useState(localStorage.getItem('fairq_pref_push') !== '0');
  const [windowStart, setWindowStart] = useState(localStorage.getItem('fairq_pref_window_start') || '08:00');
  const [windowEnd, setWindowEnd] = useState(localStorage.getItem('fairq_pref_window_end') || '21:00');
  const [timezone, setTimezone] = useState(localStorage.getItem('fairq_timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [language, setLanguage] = useState(localStorage.getItem('fairq_language') || 'en');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // default to analytics for demo
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('fairq_phone', phone);
  }, [phone]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: fullName, email });
      localStorage.setItem('fairq_pref_email', emailNotif ? '1' : '0');
      localStorage.setItem('fairq_pref_sms', smsNotif ? '1' : '0');
      localStorage.setItem('fairq_pref_push', pushNotif ? '1' : '0');
      localStorage.setItem('fairq_pref_window_start', windowStart);
      localStorage.setItem('fairq_pref_window_end', windowEnd);
      localStorage.setItem('fairq_timezone', timezone);
      localStorage.setItem('fairq_language', language);
      addNotification({ type: 'success', title: 'Saved', message: 'Profile and preferences updated.' });
    } catch (error) {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  // Sidebar navigation handler
  const handleSidebarTab = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'overview':
        navigate('/queue-overview');
        break;
      case 'queues':
        navigate('/my-queues');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={handleSidebarTab} sidebarOpen={sidebarOpen} />
      <div className="flex-1">
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Personal Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h1>
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Optional" />
              </div>
              <div className="md:col-span-2">
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={saving} className="inline-flex items-center space-x-2 bg-blue-600 text-white py-3 px-5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Account Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="password" placeholder="Current password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input type="password" placeholder="New password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input type="password" placeholder="Confirm new password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Enable Two-Factor Authentication</span>
              </label>
              <input placeholder="Security question (optional)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <input placeholder="Security answer (optional)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center space-x-3"><input type="checkbox" checked={emailNotif} onChange={(e)=>setEmailNotif(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/><span className="text-sm">Email Notifications</span></label>
              <label className="flex items-center space-x-3"><input type="checkbox" checked={smsNotif} onChange={(e)=>setSmsNotif(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/><span className="text-sm">SMS Alerts</span></label>
              <label className="flex items-center space-x-3"><input type="checkbox" checked={pushNotif} onChange={(e)=>setPushNotif(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/><span className="text-sm">Push Notifications</span></label>
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred window start</label>
                <input type="time" value={windowStart} onChange={(e)=>setWindowStart(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred window end</label>
                <input type="time" value={windowEnd} onChange={(e)=>setWindowEnd(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time zone</label>
                <input value={timezone} onChange={(e)=>setTimezone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center space-x-3"><input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded"/><span className="text-sm">Allow anonymized data sharing</span></label>
              <button className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Download my data</button>
              <button className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Deactivate account</button>
            </div>
          </motion.div>

          {/* Activity Logs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Logs & History</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Recent login: {new Date().toLocaleString()}</p>
              <p>Recent queue interaction: Viewed dashboard</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

