import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import ExamRegistration from './pages/ExamRegistration';
import QueueStatus from './pages/QueueStatus';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueueProvider } from './context/QueueContext';
import Chatbot from './components/Chatbot';
import NotificationToast from './components/NotificationToast';
import SettingsPage from './pages/SettingsPage';
import ProfileSettings from './pages/ProfileSettings';
import MainLayout from './components/MainLayout';
import MyQueues from './components/MyQueues';
import Analytics from './components/Analytics';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <QueueProvider>
          <Router>
            <div className="relative">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                  <Route path="/booking" element={<MainLayout><BookingPage /></MainLayout>} />
                  <Route path="/exam-registration" element={<MainLayout><ExamRegistration /></MainLayout>} />
                  <Route path="/queue-status/:queueId" element={<MainLayout><QueueStatus /></MainLayout>} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<MainLayout><ProfileSettings /></MainLayout>} />
                  <Route path="/my-queues" element={<MainLayout><MyQueues /></MainLayout>} />
                  <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
                </Routes>
              </AnimatePresence>
              <Chatbot />
              <NotificationToast />
            </div>
          </Router>
        </QueueProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;