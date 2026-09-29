import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Compass, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@exploria.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login(email, password);
      showToast(`Welcome back, ${res.data.user.name}!`, 'success');

      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else if (res.data.user.role === 'GUIDE') navigate('/guide');
      else navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  function setDemoCredentials(demoEmail, demoRole) {
    setEmail(demoEmail);
    setPassword('password123');
    showToast(`Loaded ${demoRole} demo credentials`, 'info');
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center max-w-md mx-auto px-4 py-12">
      <div className="w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Exploria</h2>
          <p className="text-xs text-slate-500">Access your travel bookings, matched guides, and dashboard.</p>
        </div>

        {/* Demo Quick Account Chips */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">Quick Demo Login</span>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
            <button type="button" onClick={() => setDemoCredentials('admin@exploria.com', 'Admin')} className="py-1.5 bg-slate-800 text-teal-400 rounded-xl hover:bg-slate-900 transition">Admin</button>
            <button type="button" onClick={() => setDemoCredentials('aarav.guide@exploria.com', 'Guide')} className="py-1.5 bg-slate-800 text-emerald-400 rounded-xl hover:bg-slate-900 transition">Guide</button>
            <button type="button" onClick={() => setDemoCredentials('maya.user@exploria.com', 'User')} className="py-1.5 bg-slate-800 text-blue-400 rounded-xl hover:bg-slate-900 transition">User</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-10 pr-4 py-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-500/25 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account? <Link to="/register" className="text-teal-600 font-bold hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}
