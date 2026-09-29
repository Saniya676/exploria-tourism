import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { guideService } from '../../services/api';

export default function GuideProfile() {
  const { guideProfile, checkAuthStatus } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    location: guideProfile?.location || 'Manali, India',
    experience_years: guideProfile?.experience_years || 5,
    languages: Array.isArray(guideProfile?.languages) ? guideProfile.languages.join(', ') : 'English, Hindi',
    specializations: Array.isArray(guideProfile?.specializations) ? guideProfile.specializations.join(', ') : 'Trekking, Camping',
    hourly_rate: guideProfile?.hourly_rate || 30.00
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const langs = form.languages.split(',').map(s => s.trim()).filter(Boolean);
      const specs = form.specializations.split(',').map(s => s.trim()).filter(Boolean);

      const res = await guideService.updateProfile({
        location: form.location,
        experience_years: Number(form.experience_years),
        languages: langs,
        specializations: specs,
        hourly_rate: Number(form.hourly_rate)
      });

      if (res.success) {
        showToast('Guide profile updated successfully', 'success');
        await checkAuthStatus();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update guide profile', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">Guide Credentials & Expertise</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your location, languages, specializations, and hourly rate for traveler matching.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Base Location / Familiar Region</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Experience (Years)</label>
            <input
              type="number"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Hourly Rate ($)</label>
            <input
              type="number"
              value={form.hourly_rate}
              onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Languages Spoken (Comma separated)</label>
          <input
            type="text"
            value={form.languages}
            onChange={(e) => setForm({ ...form, languages: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Specializations (Comma separated)</label>
          <input
            type="text"
            value={form.specializations}
            onChange={(e) => setForm({ ...form, specializations: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition"
        >
          {loading ? 'Saving...' : 'Update Guide Profile'}
        </button>
      </form>
    </div>
  );
}
