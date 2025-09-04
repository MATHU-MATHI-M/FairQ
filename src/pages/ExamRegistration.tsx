import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  Users, 
  Shield,
  Clock,
  Star,
  ArrowRight,
  Award,
  BookOpen
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const ExamRegistration = () => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'general',
    center: ''
  });
  const [isJoiningQueue, setIsJoiningQueue] = useState(false);
  
  const { joinQueue } = useQueue();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  const exams = [
    {
      id: 'upsc',
      name: 'UPSC Civil Services',
      icon: <Award className="w-8 h-8" />,
      description: 'Union Public Service Commission examination',
      registrationFee: '₹100',
      deadline: '2025-03-15',
      avgWait: '8-12 min',
      difficulty: 'Very High',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'tnpsc',
      name: 'TNPSC Group Exams',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Tamil Nadu Public Service Commission',
      registrationFee: '₹150',
      deadline: '2025-02-28',
      avgWait: '5-8 min',
      difficulty: 'High',
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'nptel',
      name: 'NPTEL Courses',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'National Programme on Technology Enhanced Learning',
      registrationFee: 'Free',
      deadline: '2025-04-10',
      avgWait: '2-4 min',
      difficulty: 'Medium',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'gate',
      name: 'GATE 2025',
      icon: <FileText className="w-8 h-8" />,
      description: 'Graduate Aptitude Test in Engineering',
      registrationFee: '₹1850',
      deadline: '2025-01-31',
      avgWait: '10-15 min',
      difficulty: 'Very High',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'neet',
      name: 'NEET UG',
      icon: <Award className="w-8 h-8" />,
      description: 'National Eligibility cum Entrance Test',
      registrationFee: '₹1700',
      deadline: '2025-03-20',
      avgWait: '12-18 min',
      difficulty: 'Very High',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'jee',
      name: 'JEE Main',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Joint Entrance Examination',
      registrationFee: '₹1000',
      deadline: '2025-02-15',
      avgWait: '15-20 min',
      difficulty: 'Very High',
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  const handleJoinQueue = async () => {
    if (!selectedExam) return;
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Login required',
        message: 'Please log in to join the registration queue.'
      });
      return;
    }
    
    setIsJoiningQueue(true);
    
    try {
      const exam = exams.find(e => e.id === selectedExam);
      const queueId = await joinQueue({
        userId: user.id,
        queueType: 'exam',
        service: exam?.name || selectedExam,
        status: 'waiting',
        estimatedWaitTime: Math.floor(Math.random() * 15) + 10,
        priority: exam?.difficulty === 'Very High' ? 'high' : 'medium'
      });

      addNotification({
        type: 'success',
        title: 'Registration Queue Joined!',
        message: `You've been added to the ${exam?.name} registration queue. Your position is blockchain-secured.`
      });

      navigate(`/queue-status/${queueId}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Queue Join Failed',
        message: 'Unable to join the registration queue. Please try again.'
      });
    } finally {
      setIsJoiningQueue(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
              <Link to="/booking" className="text-gray-700 hover:text-blue-600 transition-colors">
                Transportation
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
            Exam Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Register for competitive exams with guaranteed fair access. 
            Our blockchain system prevents server crashes and ensures equal opportunity.
          </p>
        </motion.div>

        {/* Exam Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {exams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedExam(exam.id)}
              className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedExam === exam.id
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${exam.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                {exam.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {exam.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {exam.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee:</span>
                  <span className="font-medium text-gray-700">{exam.registrationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deadline:</span>
                  <span className="font-medium text-gray-700">{exam.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Queue Wait:</span>
                  <span className="font-medium text-gray-700">{exam.avgWait}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className={`font-medium ${
                    exam.difficulty === 'Very High' ? 'text-red-600' :
                    exam.difficulty === 'High' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {exam.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Registration Form */}
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              {exams.find(e => e.id === selectedExam)?.icon}
              <span>Register for {exams.find(e => e.id === selectedExam)?.name}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={registrationData.category}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                  <option value="ews">EWS</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Exam Center
                </label>
                <input
                  type="text"
                  value={registrationData.center}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, center: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your preferred exam center city"
                />
              </div>
            </div>

            {/* Blockchain Security Info */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Secure Registration Process</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Fair queue management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Blockchain verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Anti-fraud protection</span>
                </div>
              </div>
            </div>

            {/* Join Queue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinQueue}
              disabled={isJoiningQueue || !registrationData.fullName || !registrationData.email || !registrationData.phone}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isJoiningQueue ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining Registration Queue...</span>
                </>
              ) : (
                <>
                  <span>Join Registration Queue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Your registration slot is guaranteed with blockchain security. No system crashes can affect your position!
            </p>
          </motion.div>
        )}

        {/* Live Registration Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { title: 'Active Registrations', value: '89,247', subtitle: 'This month' },
            { title: 'Queue Success Rate', value: '99.97%', subtitle: 'Blockchain verified' },
            { title: 'Avg. Processing', value: '8.5 min', subtitle: 'Per registration' },
            { title: 'Exams Available', value: '156', subtitle: 'Nationwide' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.title}</div>
              <div className="text-sm text-gray-600">{stat.subtitle}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ExamRegistration;