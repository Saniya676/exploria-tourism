import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Star, Trash2 } from 'lucide-react';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      setLoading(true);
      const res = await reviewService.getReviews();
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewService.delete(id);
      showToast('Review deleted', 'info');
      await fetchReviews();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Moderate User Reviews</h1>
        <p className="text-xs text-slate-400 mt-1">Audit customer feedback ratings and moderate inappropriate comments.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <img src={r.user_avatar} alt={r.user_name} className="w-7 h-7 rounded-full object-cover" />
                <span className="font-bold text-xs text-white">{r.user_name}</span>
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {r.rating} / 5
                </span>
              </div>
              <p className="text-xs text-slate-300 italic pt-1">"{r.comment}"</p>
              <p className="text-[10px] text-slate-500">Target: {r.package_title || 'General'}</p>
            </div>

            <button onClick={() => handleDelete(r.id)} className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
