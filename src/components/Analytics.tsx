import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Activity } from 'lucide-react';

const Analytics = () => {
  const chartData = [
    { day: 'Mon', users: 1200, avgWait: 8.5 },
    { day: 'Tue', users: 1400, avgWait: 7.2 },
    { day: 'Wed', users: 1100, avgWait: 9.1 },
    { day: 'Thu', users: 1600, avgWait: 6.8 },
    { day: 'Fri', users: 1800, avgWait: 8.2 },
    { day: 'Sat', users: 2200, avgWait: 12.4 },
    { day: 'Sun', users: 1900, avgWait: 10.1 }
  ];

  const maxUsers = Math.max(...chartData.map(d => d.users));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Throughput', value: '11,300', icon: <TrendingUp className="w-6 h-6" />, change: '+12%' },
          { title: 'Peak Concurrent Users', value: '2,247', icon: <Users className="w-6 h-6" />, change: '+8%' },
          { title: 'Avg. Wait Time', value: '8.9 min', icon: <Clock className="w-6 h-6" />, change: '-15%' },
          { title: 'System Uptime', value: '99.99%', icon: <Activity className="w-6 h-6" />, change: '+0.01%' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="text-blue-600">{metric.icon}</div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-4">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Daily User Traffic</h3>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <motion.div
                key={data.day}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <span className="text-sm font-medium text-gray-600 w-8">{data.day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.users / maxUsers) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16">{data.users}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wait Time Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Average Wait Time Trends</h3>
          <div className="space-y-4">
            {chartData.map((data, index) => (
              <motion.div
                key={data.day}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <span className="text-sm font-medium text-gray-600 w-8">{data.day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.avgWait / 15) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16">{data.avgWait}m</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Blockchain Security Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Blockchain Security Status</h3>
            <p className="text-blue-100">All queue operations are cryptographically secured</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">99.97%</div>
            <div className="text-blue-100 text-sm">Verification Rate</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-500">
          <div className="text-center">
            <div className="text-2xl font-bold">24,847</div>
            <div className="text-blue-100 text-sm">Blocks Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0.02s</div>
            <div className="text-blue-100 text-sm">Avg. Verification Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-blue-100 text-sm">Uptime</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;