import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { coins } = useResume();

  const menuItems = [
    { path: '/ocr', label: 'Upload Resume', icon: '📝' },
    { path: '/my-resumes', label: 'My Resumes', icon: '📄' },
    { path: '/job-matcher', label: 'Job Matcher', icon: '✅' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/recently-funded', label: 'Funded Startups', icon: '💰' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden mr-4 text-gray-600 hover:text-gray-800"
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-800">ResumeRocket AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
              Home
            </Link>
            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-black text-gray-100 transform transition-transform duration-200 ease-in-out z-30 flex flex-col`}
        >
          <div className="p-5 border-b border-gray-800">
            <Link to="/" className="text-xl font-bold">📄 ResumeRocket AI</Link>
          </div>
          <nav className="p-4 space-y-1 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center space-x-3 px-4 py-0">
              <span className="text-yellow-400 text-xl">🪙</span>
              <div>
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="font-semibold text-white">{coins} coins</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 ResumeRocket AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 