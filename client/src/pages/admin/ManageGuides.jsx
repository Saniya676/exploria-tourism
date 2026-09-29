import React, { useState, useEffect } from 'react';
import { guideService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Star, CheckCircle } from 'lucide-react';

export default function ManageGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    try {
      setLoading(true);
      const res = await guideService.getAll();
      if (res.success) setGuides(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Manage Verified Local Guides</h1>
        <p className="text-xs text-slate-400 mt-1">Audit active local guides, locations, ratings, and rates.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Guide</th>
              <th className="p-3">Location</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Hourly Rate</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {guides.map((g) => (
              <tr key={g.id} className="hover:bg-slate-800/50">
                <td className="p-3 font-bold text-white flex items-center gap-3">
                  <img src={g.avatar} alt={g.name} className="w-8 h-8 rounded-full object-cover" />
                  <span>{g.name}</span>
                </td>
                <td className="p-3">{g.location}</td>
                <td className="p-3">{g.experience_years} Years</td>
                <td className="p-3 font-bold text-amber-400">{g.rating} ({g.reviews_count})</td>
                <td className="p-3 font-bold text-emerald-400">${g.hourly_rate}/hr</td>
                <td className="p-3">
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    APPROVED & ACTIVE
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
