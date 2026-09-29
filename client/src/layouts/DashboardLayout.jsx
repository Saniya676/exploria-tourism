import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ChatWidget from '../components/chat/ChatWidget';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold">Loading Exploria Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar />
          <main className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 min-h-[600px] shadow-2xl">
            <Outlet />
          </main>
        </div>
      </div>
      <ChatWidget />
      <Footer />
    </div>
  );
}
