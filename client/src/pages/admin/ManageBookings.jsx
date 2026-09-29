import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { BookmarkCheck, Search } from 'lucide-react';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [search, status]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await bookingService.getAll({ search, status });
      if (res.success) setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await bookingService.updateStatus(id, newStatus);
      if (res.success) {
        showToast(`Booking status changed to ${newStatus}`, 'success');
        await fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manage Tour Bookings</h1>
          <p className="text-xs text-slate-400 mt-1">Audit active guest bookings and change reservation statuses.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search booking code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 font-bold"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PENDING">PENDING</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Booking Code</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Package</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-teal-400">{b.booking_code}</td>
                <td className="p-3">
                  <div className="font-bold text-white">{b.user_name}</div>
                  <div className="text-[10px] text-slate-400">{b.user_email}</div>
                </td>
                <td className="p-3 font-semibold text-slate-200">{b.package_title}</td>
                <td className="p-3 font-bold text-emerald-400">${b.total_amount}</td>
                <td className="p-3">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white font-bold rounded-lg p-1.5 text-xs"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
