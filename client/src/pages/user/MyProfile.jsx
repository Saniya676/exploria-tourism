import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/api';
import { User, Mail, Phone, FileText, Camera } from 'lucide-react';

export default function MyProfile() {
  const { user, checkAuthStatus } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authService.updateProfile(form);
      if (res.success) {
        showToast('Profile updated successfully', 'success');
        await checkAuthStatus();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-white">My Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Update your profile information and contact avatar.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-4 text-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-700/60">
          <img src={form.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-500" />
          <div className="flex-1">
            <label className="block text-slate-300 font-semibold mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Email Address (Read-only)</label>
          <input
            type="email"
            disabled
            value={user?.email}
            className="w-full bg-slate-950 border border-slate-800 text-slate-400 rounded-xl p-3 font-medium cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-semibold"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Bio / Travel Preferences</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition"
        >
          {loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
