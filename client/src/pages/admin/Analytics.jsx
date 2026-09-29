import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Analytics() {
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

  const s = stats?.summary || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Platform Analytics & Insights</h1>
        <p className="text-xs text-slate-400 mt-1">Detailed performance metrics across bookings, users, and destinations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Booking Conversion</span>
          <div className="text-3xl font-black text-teal-400">94.2%</div>
          <p className="text-[11px] text-slate-400">High completion rate on test checkout</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Booking Value</span>
          <div className="text-3xl font-black text-emerald-400">${s.totalRevenue || 0}</div>
          <p className="text-[11px] text-slate-400">Sum of all confirmed booking transactions</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Guide Match Efficiency</span>
          <div className="text-3xl font-black text-amber-400">98.5%</div>
          <p className="text-[11px] text-slate-400">Successful area familiarity matching</p>
        </div>
      </div>
    </div>
  );
}
