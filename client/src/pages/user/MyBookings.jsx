import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { BookmarkCheck, Calendar, Users, XCircle } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await bookingService.getMy();
      if (res.success) setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await bookingService.cancel(id);
      if (res.success) {
        showToast('Booking cancelled successfully', 'info');
        await fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">My Active Bookings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your active tour reservations and booking codes.</p>
      </div>

      {loading ? (
        <div className="h-40 bg-slate-800 rounded-2xl animate-pulse" />
      ) : bookings.length === 0 ? (
        <div className="bg-slate-800/50 p-8 rounded-3xl text-center border border-slate-700/60 text-xs text-slate-400">
          No bookings active right now.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-400">{b.booking_code}</span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {b.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{b.package_title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-3">
                  <span><Calendar className="w-3.5 h-3.5 inline mr-1 text-teal-400" />{b.travel_date}</span>
                  <span><Users className="w-3.5 h-3.5 inline mr-1 text-teal-400" />{b.travelers_count} Travelers</span>
                </p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-700 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Paid</span>
                  <span className="text-xl font-extrabold text-white">${b.total_amount}</span>
                </div>

                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-rose-500/20"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
