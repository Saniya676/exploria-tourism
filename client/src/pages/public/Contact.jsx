import React, { useState } from 'react';
import { inquiryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await inquiryService.create(form);
      if (res.success) {
        showToast(res.message, 'success');
        setSubmittedRef(res.message);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <MessageSquare className="w-4 h-4" /> Direct Communication
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch With Exploria
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have questions about custom family itineraries, guide assignments, or trip bookings? Drop us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Side */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-teal-400">Exploria Headquarters</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
                <span>Exploria Global Tech Park, Adventure Avenue, Sector 6, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>+91 1800-EXPLORIA</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>support@exploria.com</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs text-slate-300">
            ⚡ <strong>Rapid Assistance:</strong> All inquiries are assigned a unique backend reference ID (EXP-XXXXXXXX) and logged in our system.
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
          {submittedRef ? (
            <div className="p-8 bg-teal-50 border border-teal-200 rounded-3xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
              <h3 className="text-xl font-bold text-teal-900">Inquiry Received!</h3>
              <p className="text-xs text-teal-800 font-semibold leading-relaxed">{submittedRef}</p>
              <button
                onClick={() => setSubmittedRef(null)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-teal-600 transition"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Hunter"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Custom Family Package Query"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your travel dates, destination requirements, or guide preferences..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting to Server...' : 'Send Travel Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
