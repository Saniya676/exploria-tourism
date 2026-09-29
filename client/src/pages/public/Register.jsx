import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Compass, User, Mail, Lock, Phone, Shield } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await register(form);
      showToast('Account registered successfully!', 'success');
      if (res.data.user.role === 'GUIDE') navigate('/guide');
      else navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center max-w-md mx-auto px-4 py-12">
      <div className="w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Join Exploria</h2>
          <p className="text-xs text-slate-500">Create an account as a traveler or verified local guide.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Hunter"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@example.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Account Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-bold focus:outline-none focus:border-teal-500"
            >
              <option value="USER">Traveler / User</option>
              <option value="GUIDE">Verified Local Guide</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-500/25 transition"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-teal-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
