import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatWidget from '../components/chat/ChatWidget';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
}
