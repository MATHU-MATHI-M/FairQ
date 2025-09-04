import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useNotification } from '../context/NotificationContext';

const QueueStatus = () => {
  const { queueId } = useParams();
  const { getQueuePosition, updateQueueStatus } = useQueue();
  const { addNotification } = useNotification();
  const [queueData, setQueueData] = useState(getQueuePosition(queueId || ''));
  const [timeInQueue, setTimeInQueue] = useState(0);

  useEffect(() => {
    // Keep queueData in sync with context when route changes
    setQueueData(getQueuePosition(queueId || '') );
  }, [queueId, getQueuePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInQueue(prev => prev + 1);
      // Pull latest snapshot from context to reflect movement/updates
      setQueueData(prev => {
        const latest = getQueuePosition(queueId || '');
        return latest || prev;
      });
      
      // Simulate queue progression
      if (queueData && queueData.position > 1 && Math.random() < 0.1) {
        const newPosition = Math.max(1, queueData.position - 1);
        setQueueData(prev => prev ? { ...prev, position: newPosition } : null);
        
        if (newPosition === 1) {
          addNotification({
            type: 'success',
            title: 'Your Turn is Next!',
            message: 'You\'re now first in line. Get ready to proceed with your booking/registration.'
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [queueId, getQueuePosition, queueData, addNotification]);

  if (!queueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Queue Not Found</h1>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                FairQ
              </span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Queue Status Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Queue Status</h1>
          <p className="text-xl text-gray-600">
            Your position is secured with blockchain technology
          </p>
        </motion.div>

        {/* Main Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8"
        >
          {/* Status Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{queueData.service}</h2>
                <p className="text-blue-100">Queue Type: {queueData.queueType === 'transport' ? 'Transportation' : 'Exam Registration'}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">#{queueData.position}</div>
                <div className="text-blue-100">Your Position</div>
              </div>
            </div>
          </div>

          {/* Status Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {queueData.estimatedWaitTime} min
                </div>
                <div className="text-gray-600">Estimated Wait</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">Verified</div>
                <div className="text-gray-600">Blockchain Status</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatTime(timeInQueue)}
                </div>
                <div className="text-gray-600">Time in Queue</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Queue Progress</span>
                <span>{Math.max(0, 100 - (queueData.position * 10))}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, 100 - (queueData.position * 10))}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Blockchain Verified</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Your queue position is cryptographically secured and cannot be manipulated.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Hash:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{queueData.blockchainHash}</code>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Queue Analytics</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">People ahead:</span>
                <span className="font-semibold">{queueData.position - 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average processing:</span>
                <span className="font-semibold">2.5 min/person</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Queue efficiency:</span>
                <span className="font-semibold text-green-600">98.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>System Status</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Server Status:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-600">Online</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blockchain Network:</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Queue Integrity:</span>
                <span className="font-semibold text-green-600">100%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QueueStatus;