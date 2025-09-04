import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Ticket, 
  Settings, 
  Shield,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: <Users className="w-5 h-5" />, to: '/dashboard' },
    { id: 'queues', label: 'My Queues', icon: <Ticket className="w-5 h-5" />, to: '/my-queues' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, to: '/analytics' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, to: '/settings' }
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: sidebarOpen ? 256 : 80,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 border-r border-gray-200"
    >
      <div className="p-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
            >
              FairQ
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-md'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
              end
            >
              <div className="transition-colors">
                {item.icon}
              </div>
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {/* Show Chevron if active */}
                  {/* isActive is not available here, but you can style with active class */}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Blockchain Status */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className={`flex items-center space-x-3 px-3 py-2 ${
            sidebarOpen ? '' : 'justify-center'
          }`}>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm font-medium text-gray-700">Blockchain Active</p>
                <p className="text-xs text-gray-500">Queue integrity verified</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;