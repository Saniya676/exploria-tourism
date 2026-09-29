import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { guideService, bookingService } from '../../services/api';
import { LayoutDashboard, MessageSquare, BookmarkCheck, Star, Award, CheckCircle } from 'lucide-react';

export default function GuideDashboard() {
  const { user, guideProfile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuideData();
  }, []);

  async function fetchGuideData() {
    try {
      setLoading(true);
      const [rRes, bRes] = await Promise.all([
        guideService.getRequests(),
        bookingService.getGuideBookings()
      ]);
      if (rRes.success) setRequests(rRes.data);
      if (bRes.success) setBookings(bRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Guide Portal – {user?.name}</h1>
        <p className="text-xs text-slate-400 mt-1">Manage tour requests, guest communication, and guide schedule.</p>
      </div>

      {/* Guide Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Guide Location</span>
          <p className="text-sm font-extrabold text-teal-400 truncate">{guideProfile?.location || 'Not set'}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rating</span>
          <p className="text-xl font-black text-amber-400 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" /> {guideProfile?.rating || 5.0}
          </p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Incoming Requests</span>
          <p className="text-2xl font-black text-white">{requests.length}</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Bookings</span>
          <p className="text-2xl font-black text-white">{bookings.length}</p>
        </div>
      </div>

      {/* Requests */}
      <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 space-y-4">
        <h3 className="font-bold text-base text-white">Incoming Tour Requests</h3>
        {requests.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No pending requests right now.</p>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 3).map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{r.user_name} ({r.destination})</h4>
                  <p className="text-slate-400">{r.travel_dates} • {r.travelers_count} Person(s) • Budget: ${r.budget}</p>
                </div>
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
