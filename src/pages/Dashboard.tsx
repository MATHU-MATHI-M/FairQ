import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import QueueOverview from '../components/QueueOverview';
import LiveQueueList from '../components/LiveQueueList';
import Analytics from '../components/Analytics';
import MyQueues from '../components/MyQueues';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
        case 'overview':
          return (
            <div>
              <QueueOverview />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-3">
                  <LiveQueueList />
                </div>
              </div>
            </div>
          );
      case 'queues':
        return <MyQueues />;
      case 'analytics':
        return <Analytics />;
      default:
        return <QueueOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 transition-all duration-300">
          <div className="p-6 lg:p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;