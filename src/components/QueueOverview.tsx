import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp, Shield } from 'lucide-react';

const QueueOverview = () => {
  const stats = [
    {
      title: 'Active Queues',
      value: '12',
      change: '+2 from yesterday',
      changeType: 'positive',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Total Users Waiting',
      value: '1,247',
      change: '+156 from last hour',
      changeType: 'positive',
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: 'Average Wait Time',
      value: '8.2 min',
      change: '-2.1 min from yesterday',
      changeType: 'positive',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Blockchain Verifications',
      value: '99.97%',
      change: 'Last 24 hours',
      changeType: 'neutral',
      icon: <Shield className="w-6 h-6" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Queue Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-600">
                {stat.icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {stat.changeType === 'positive' ? '↗' : '→'}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className={`text-xs mt-2 ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default QueueOverview;