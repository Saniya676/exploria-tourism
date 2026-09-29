import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import { BookmarkCheck, Calendar, Users, Phone, Mail } from 'lucide-react';

export default function GuideBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await bookingService.getGuideBookings();
      if (res.success) setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Assigned Tour Bookings</h1>
        <p className="text-xs text-slate-400 mt-1">View confirmed guest reservations where you are assigned as lead guide.</p>
      </div>

      {loading ? (
        <div className="h-40 bg-slate-800 rounded-2xl animate-pulse" />
      ) : bookings.length === 0 ? (
        <div className="bg-slate-800/50 p-8 rounded-3xl text-center border border-slate-700/60 text-xs text-slate-400">
          No bookings assigned right now.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <span className="text-xs font-bold text-teal-400">{b.booking_code}</span>
                  <h3 className="font-bold text-base text-white">{b.package_title}</h3>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <p><strong>Guest Name:</strong> {b.user_name}</p>
                  <p><strong>Email:</strong> {b.user_email}</p>
                  <p><strong>Phone:</strong> {b.user_phone || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Departure Date:</strong> {b.travel_date}</p>
                  <p><strong>Travelers Count:</strong> {b.travelers_count} Person(s)</p>
                  <p><strong>Special Notes:</strong> {b.special_notes || 'None'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
