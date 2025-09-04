import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Shield, 
  ExternalLink, 
  Plane, 
  Train, 
  Bus, 
  GraduationCap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';

const MyQueues = () => {
  const { queues } = useQueue();
  const { user } = useAuth();

  const userQueues = queues.filter(q => q.userId === user?.id);

  const getServiceIcon = (service: string, queueType: string) => {
    if (queueType === 'transport') {
      if (service.toLowerCase().includes('flight')) return <Plane className="w-5 h-5" />;
      if (service.toLowerCase().includes('train')) return <Train className="w-5 h-5" />;
      if (service.toLowerCase().includes('bus')) return <Bus className="w-5 h-5" />;
    }
    return <GraduationCap className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (userQueues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Queues</h2>
        <p className="text-gray-600 mb-8">You haven't joined any queues yet. Start by booking transportation or registering for exams.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/booking"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Transportation
          </Link>
          <Link 
            to="/exam-registration"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Register for Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Queues</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userQueues.map((queue, index) => (
          <motion.div
            key={queue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {getServiceIcon(queue.service, queue.queueType)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{queue.service}</h3>
                  <p className="text-sm text-gray-600 capitalize">{queue.queueType} Queue</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(queue.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(queue.status)}
                  <span className="capitalize">{queue.status}</span>
                </div>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">#{queue.position}</div>
                <div className="text-sm text-gray-600">Position</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{queue.estimatedWaitTime}m</div>
                <div className="text-sm text-gray-600">Est. Wait</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Blockchain Verified</span>
              </div>
              <div className="text-xs text-gray-500">
                {queue.timestamp.toLocaleString()}
              </div>
            </div>

            <Link 
              to={`/queue-status/${queue.id}`}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Details</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyQueues;