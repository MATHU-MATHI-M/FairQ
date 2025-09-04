import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Shield, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';

interface QueueItem {
  id: string;
  name: string;
  position: number;
  waitTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'waiting' | 'processing' | 'completed';
  blockchainVerified: boolean;
}

const LiveQueueList = () => {
  const [queueData, setQueueData] = useState<QueueItem[]>([
    {
      id: '1',
      name: 'Flight Booking - Mumbai to Delhi',
      position: 1,
      waitTime: '2 min',
      priority: 'high',
      status: 'processing',
      blockchainVerified: true
    },
    {
      id: '2',
      name: 'UPSC Registration 2025',
      position: 2,
      waitTime: '5 min',
      priority: 'medium',
      status: 'waiting',
      blockchainVerified: true
    },
    {
      id: '3',
      name: 'Train Booking - Chennai Express',
      position: 3,
      waitTime: '8 min',
      priority: 'high',
      status: 'waiting',
      blockchainVerified: true
    },
    {
      id: '4',
      name: 'TNPSC Group 2 Registration',
      position: 4,
      waitTime: '12 min',
      priority: 'low',
      status: 'waiting',
      blockchainVerified: true
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Users className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(prev => 
        prev.map(item => ({
          ...item,
          waitTime: Math.max(0, parseInt(item.waitTime) - 1) + ' min'
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Live Queue Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {queueData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 font-bold">#{item.position}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.blockchainVerified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center space-x-1"
                        >
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Verified</span>
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Est. {item.waitTime}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(item.status)}
                        <span className="text-sm text-gray-600 capitalize">{item.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority.toUpperCase()}
                  </span>
                  
                  {item.priority === 'high' && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>All positions blockchain verified</span>
          </div>
          <span className="text-gray-500">Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default LiveQueueList;