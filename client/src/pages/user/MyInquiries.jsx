import React, { useState, useEffect } from 'react';
import { inquiryService } from '../../services/api';
import { MessageSquare, Clock } from 'lucide-react';

export default function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const res = await inquiryService.getMy();
      if (res.success) setInquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">My Travel Inquiries</h1>
        <p className="text-xs text-slate-400 mt-1">Track responses to your submitted inquiry reference IDs.</p>
      </div>

      {loading ? (
        <div className="h-40 bg-slate-800 rounded-2xl animate-pulse" />
      ) : inquiries.length === 0 ? (
        <div className="bg-slate-800/50 p-8 rounded-3xl text-center border border-slate-700/60 text-xs text-slate-400">
          No travel inquiries submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400">Reference ID: {inq.reference_id}</span>
                  <h3 className="font-bold text-sm text-white mt-0.5">{inq.subject}</h3>
                </div>
                <span className="text-[10px] font-extrabold text-teal-400 uppercase bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30 self-start">
                  Status: {inq.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{inq.message}</p>
              <div className="text-[10px] text-slate-500 pt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Submitted on {new Date(inq.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
