import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { guideService } from '../../services/api';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function GuideAvailability() {
  const { guideProfile, checkAuthStatus } = useAuth();
  const { showToast } = useToast();

  const [status, setStatus] = useState(guideProfile?.availability_status || 'AVAILABLE');
  const [loading, setLoading] = useState(false);

  async function handleToggle(newStatus) {
    try {
      setLoading(true);
      const res = await guideService.updateProfile({ availability_status: newStatus });
      if (res.success) {
        setStatus(newStatus);
        showToast(`Availability status updated to ${newStatus}`, 'success');
        await checkAuthStatus();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-white">Guide Availability Status</h1>
        <p className="text-xs text-slate-400 mt-1">Set your availability to accept new traveler matching requests.</p>
      </div>

      <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Current Status:</span>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleToggle('AVAILABLE')}
            disabled={loading}
            className={`p-4 rounded-2xl text-xs font-bold transition border ${status === 'AVAILABLE' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'}`}
          >
            AVAILABLE
          </button>

          <button
            onClick={() => handleToggle('BUSY')}
            disabled={loading}
            className={`p-4 rounded-2xl text-xs font-bold transition border ${status === 'BUSY' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'}`}
          >
            BUSY
          </button>

          <button
            onClick={() => handleToggle('UNAVAILABLE')}
            disabled={loading}
            className={`p-4 rounded-2xl text-xs font-bold transition border ${status === 'UNAVAILABLE' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'}`}
          >
            OFFLINE
          </button>
        </div>
      </div>
    </div>
  );
}
