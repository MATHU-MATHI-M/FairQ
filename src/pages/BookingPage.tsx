import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Train, 
  Bus, 
  Calendar, 
  MapPin, 
  Users, 
  Shield,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const [selectedService, setSelectedService] = useState<'flight' | 'train' | 'bus' | null>(null);
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    class: 'economy'
  });
  const [isJoiningQueue, setIsJoiningQueue] = useState(false);
  
  const { joinQueue } = useQueue();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      id: 'flight' as const,
      name: 'Flights',
      icon: <Plane className="w-8 h-8" />,
      description: 'Book domestic and international flights',
      avgWait: '5-8 min',
      popularity: 'High',
      color: 'from-sky-400 to-blue-500'
    },
    {
      id: 'train' as const,
      name: 'Trains',
      icon: <Train className="w-8 h-8" />,
      description: 'Reserve train tickets across the country',
      avgWait: '3-5 min',
      popularity: 'Very High',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'bus' as const,
      name: 'Buses',
      icon: <Bus className="w-8 h-8" />,
      description: 'Book bus tickets for intercity travel',
      avgWait: '2-4 min',
      popularity: 'Medium',
      color: 'from-orange-400 to-red-500'
    }
  ];

  const handleJoinQueue = async () => {
    if (!selectedService) return;
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Login required',
        message: 'Please log in to join the booking queue.'
      });
      return;
    }
    
    setIsJoiningQueue(true);
    
    try {
      const queueId = await joinQueue({
        userId: user.id,
        queueType: 'transport',
        service: selectedService,
        status: 'waiting',
        estimatedWaitTime: Math.floor(Math.random() * 10) + 5,
        priority: 'medium'
      });

      addNotification({
        type: 'success',
        title: 'Joined Queue Successfully!',
        message: `You've been added to the ${selectedService} booking queue. Position secured with blockchain verification.`
      });

      navigate(`/queue-status/${queueId}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Queue Join Failed',
        message: 'Unable to join the queue. Please try again.'
      });
    } finally {
      setIsJoiningQueue(false);
    }
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
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/exam-registration" className="text-gray-700 hover:text-blue-600 transition-colors">
                Exam Registration
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transportation Booking
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure your travel tickets with our blockchain-powered queue system. 
            No more server crashes during festival seasons!
          </p>
        </motion.div>

        {/* Service Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedService(service.id)}
              className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ${
                selectedService === service.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                {service.name}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {service.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Avg. Wait:</span>
                  <span className="font-medium text-gray-700">{service.avgWait}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Demand:</span>
                  <span className={`font-medium ${
                    service.popularity === 'Very High' ? 'text-red-600' :
                    service.popularity === 'High' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {service.popularity}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Booking Form */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              {services.find(s => s.id === selectedService)?.icon}
              <span>Book {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)} Ticket</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  From
                </label>
                <input
                  type="text"
                  value={bookingData.from}
                  onChange={(e) => setBookingData(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Departure city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  To
                </label>
                <input
                  type="text"
                  value={bookingData.to}
                  onChange={(e) => setBookingData(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Destination city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Passengers
                </label>
                <select
                  value={bookingData.passengers}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Queue Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Blockchain Queue Protection</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Fair first-come-first-served</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Guaranteed position security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Cryptographic verification</span>
                </div>
              </div>
            </div>

            {/* Join Queue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinQueue}
              disabled={isJoiningQueue || !bookingData.from || !bookingData.to || !bookingData.date}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isJoiningQueue ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining Queue...</span>
                </>
              ) : (
                <>
                  <span>Join Booking Queue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Your position will be secured with blockchain technology. No queue jumping possible!
            </p>
          </motion.div>
        )}

        {/* Live Queue Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Active Queues', value: '247', subtitle: 'Across all services' },
            { title: 'Users Waiting', value: '12,847', subtitle: 'Real-time count' },
            { title: 'Avg. Processing', value: '4.2 min', subtitle: 'Per booking' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.title}</div>
              <div className="text-sm text-gray-600">{stat.subtitle}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;