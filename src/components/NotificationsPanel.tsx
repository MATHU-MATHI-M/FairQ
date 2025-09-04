import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  Clock,
  Shield
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationsPanel = () => {
  const { addNotification } = useNotification();

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Booking Queue Advanced',
      message: 'You\'ve moved up to position #3 in Flight Booking Queue',
      time: '2 min ago',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Blockchain Verification',
      message: 'Your queue position has been verified on the blockchain',
      time: '5 min ago',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'High Demand Alert',
      message: 'UPSC registration experiencing high traffic - queue times may increase',
      time: '15 min ago',
      read: true
    },
    {
      id: '4',
      type: 'success',
      title: 'Registration Completed',
      message: 'Your TNPSC exam registration has been successfully completed',
      time: '1 hour ago',
      read: true
    },
    {
      id: '5',
      type: 'info',
      title: 'New Queue Available',
      message: 'Train booking queue for Diwali season is now open',
      time: '2 hours ago',
      read: true
    }
  ];

  // Simulate real-time notifications
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        addNotification({
          type: 'info',
          title: 'Queue Update',
          message: 'Your position has been updated with blockchain verification',
          duration: 4000
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [addNotification]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <X className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50';
    
    switch (type) {
      case 'success': return 'bg-green-50 border-l-4 border-l-green-400';
      case 'warning': return 'bg-yellow-50 border-l-4 border-l-yellow-400';
      case 'error': return 'bg-red-50 border-l-4 border-l-red-400';
      default: return 'bg-blue-50 border-l-4 border-l-blue-400';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              getNotificationBg(notification.type, notification.read)
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    notification.read ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className={`text-sm mt-1 ${
                  notification.read ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {notification.message}
                </p>
                <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{notification.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;