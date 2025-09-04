import React from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Sidebar open/close logic can be added if needed
  // Sidebar width: 80px (collapsed) or 256px (expanded)
  // Navbar height: 64px (h-16)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <TopNavbar sidebarOpen={false} setSidebarOpen={() => {}} />
      <div className="flex">
        <Sidebar activeTab="" setActiveTab={() => {}} sidebarOpen={true} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 mt-16 ml-64">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
