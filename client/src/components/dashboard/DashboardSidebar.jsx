import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  MessageSquare,
  BookmarkCheck,
  Heart,
  Users,
  Compass,
  Package,
  Flame,
  HelpCircle,
  Star,
  BarChart3,
  CalendarCheck,
  Calendar
} from 'lucide-react';

export default function DashboardSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/dashboard/profile', icon: User },
    { name: 'My Inquiries', path: '/dashboard/inquiries', icon: MessageSquare },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: BookmarkCheck },
    { name: 'Saved Packages', path: '/favorites', icon: Heart },
  ];

  const guideLinks = [
    { name: 'Guide Dashboard', path: '/guide', icon: LayoutDashboard },
    { name: 'Guide Profile', path: '/guide/profile', icon: User },
    { name: 'Guide Requests', path: '/guide/requests', icon: MessageSquare },
    { name: 'Guide Bookings', path: '/guide/bookings', icon: BookmarkCheck },
    { name: 'Set Availability', path: '/guide/availability', icon: Calendar },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Guides', path: '/admin/guides', icon: ShieldCheckIcon },
    { name: 'Manage Destinations', path: '/admin/destinations', icon: Compass },
    { name: 'Manage Adventures', path: '/admin/adventures', icon: Flame },
    { name: 'Manage Packages', path: '/admin/packages', icon: Package },
    { name: 'Manage Inquiries', path: '/admin/inquiries', icon: HelpCircle },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Manage Reviews', path: '/admin/reviews', icon: Star },
  ];

  function ShieldCheckIcon(props) {
    return <Users {...props} />;
  }

  const links = user.role === 'ADMIN' ? adminLinks : user.role === 'GUIDE' ? guideLinks : userLinks;

  return (
    <aside className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-6">
      {/* User Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
          alt={user.name}
          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-500/40"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-500/20 text-teal-400 border border-teal-500/30">
            {user.role}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
