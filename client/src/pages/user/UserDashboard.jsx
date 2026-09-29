import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService, inquiryService } from '../../services/api';
import { LayoutDashboard, BookmarkCheck, MessageSquare, Heart, Clock, ArrowRight } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const [bRes, iRes] = await Promise.all([
        bookingService.getMy(),
        inquiryService.getMy()
      ]);
      if (bRes.success) setBookings(bRes.data);
      if (iRes.success) setInquiries(iRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Welcome back, {user?.name}!</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your active travel bookings, inquiries, and saved packages.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-teal-400">
            <span className="text-xs font-bold uppercase">Total Bookings</span>
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{bookings.length}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase">Travel Inquiries</span>
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{inquiries.length}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase">Account Role</span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">{user?.role}</span>
          </div>
          <p className="text-sm font-bold text-slate-300 pt-2">{user?.email}</p>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">My Active Bookings</h3>
          <Link to="/dashboard/bookings" className="text-xs text-teal-400 hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="h-24 bg-slate-800 rounded-2xl animate-pulse" />
        ) : bookings.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No active bookings found. Explore our adventure packages!</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 block">{b.booking_code}</span>
                  <h4 className="font-bold text-sm text-white">{b.package_title}</h4>
                  <p className="text-xs text-slate-400">Departure: {b.travel_date} • {b.travelers_count} Person(s)</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white block">${b.total_amount}</span>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Inquiries Section */}
      <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Recent Submitted Inquiries</h3>
          <Link to="/dashboard/inquiries" className="text-xs text-teal-400 hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No travel inquiries submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 block">{inq.reference_id}</span>
                  <h4 className="font-bold text-sm text-white">{inq.subject}</h4>
                  <p className="text-xs text-slate-400 truncate max-w-md">{inq.message}</p>
                </div>
                <span className="text-[10px] font-extrabold text-teal-400 uppercase bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
