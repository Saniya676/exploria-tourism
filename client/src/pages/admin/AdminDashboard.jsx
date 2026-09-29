import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
  Users,
  Compass,
  Package,
  BookmarkCheck,
  DollarSign,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = stats?.summary || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Admin Operations Control Center</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time platform metrics, booking revenues, and inventory counts.</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
          <div className="flex items-center justify-between text-teal-400">
            <span className="text-[10px] font-extrabold uppercase">Total Revenue</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white">${s.totalRevenue || 0}</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[10px] font-extrabold uppercase">Total Bookings</span>
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white">{s.totalBookings || 0}</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-extrabold uppercase">Registered Users</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white">{s.totalUsers || 0}</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-extrabold uppercase">Pending Inquiries</span>
            <HelpCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-white">{s.pendingInquiries || 0}</p>
        </div>
      </div>

      {/* Popular Destinations Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" /> Popular Destinations Breakdown
          </h3>
          <div className="space-y-3">
            {(stats?.popularDestinations || []).map((d, i) => (
              <div key={i} className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{d.name}</span>
                <div className="text-right">
                  <span className="text-teal-400 font-bold block">{d.booking_count || 0} Bookings</span>
                  <span className="text-[10px] text-slate-400">${d.total_revenue || 0} Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" /> Top Performing Packages
          </h3>
          <div className="space-y-3">
            {(stats?.packagePerformance || []).map((p, i) => (
              <div key={i} className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate max-w-[200px]">{p.title}</span>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">${p.price}</span>
                  <span className="text-[10px] text-slate-400">{p.total_bookings || 0} Sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
