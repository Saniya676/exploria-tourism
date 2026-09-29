import React, { useState, useEffect } from 'react';
import { guideService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Check, X } from 'lucide-react';

export default function GuideRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await guideService.getRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResponse(id, status) {
    try {
      const res = await guideService.respondRequest(id, status);
      if (res.success) {
        showToast(`Request ${status.toLowerCase()}!`, 'success');
        await fetchRequests();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update request', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Traveler Matching Requests</h1>
        <p className="text-xs text-slate-400 mt-1">Review traveler requests matched to your location and expertise.</p>
      </div>

      {loading ? (
        <div className="h-40 bg-slate-800 rounded-2xl animate-pulse" />
      ) : requests.length === 0 ? (
        <div className="bg-slate-800/50 p-8 rounded-3xl text-center border border-slate-700/60 text-xs text-slate-400">
          No traveler requests right now.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{r.user_name} ({r.destination})</h3>
                  <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Dates: {r.travel_dates} • Travelers: {r.travelers_count} • Budget: ${r.budget}</p>
                <p className="text-xs text-slate-300">Activities: {r.preferred_activities}</p>
                {r.special_requirements && <p className="text-[11px] text-teal-400 italic">"{r.special_requirements}"</p>}
              </div>

              {r.status !== 'ACCEPTED' && r.status !== 'REJECTED' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResponse(r.id, 'ACCEPTED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button
                    onClick={() => handleResponse(r.id, 'REJECTED')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
