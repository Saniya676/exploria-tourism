import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { travelPlannerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Calendar, DollarSign, Users, MapPin, Compass, ArrowRight, Sun, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TravelPlanner() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    destination: 'Manali',
    days: 3,
    travelMonth: 'October',
    budget: 600,
    travelersCount: 2,
    travelType: 'Adventure',
    interests: ['Mountains', 'Trekking', 'Photography'],
    accommodation: 'Standard Hotel',
    transport: 'Private SUV'
  });

  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);

  const travelTypes = ['Adventure', 'Family', 'Couple', 'Solo', 'Cultural', 'Nature', 'Luxury', 'Budget', 'Spiritual'];
  const interestOptions = ['Beaches', 'Mountains', 'Wildlife', 'History', 'Food', 'Photography', 'Trekking', 'Shopping', 'Culture', 'Nightlife'];

  function toggleInterest(item) {
    if (form.interests.includes(item)) {
      setForm({ ...form, interests: form.interests.filter(i => i !== item) });
    } else {
      setForm({ ...form, interests: [...form.interests, item] });
    }
  }

  async function handleGeneratePlan(e) {
    e.preventDefault();
    if (!form.destination.trim()) {
      showToast('Please enter a target destination', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await travelPlannerService.generatePlan(form);
      if (res.success) {
        setPlanResult(res.data);
        showToast('Personalized Travel Plan generated!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate travel plan', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-600 font-extrabold text-xs uppercase tracking-widest border border-teal-500/20">
          <Sparkles className="w-4 h-4 text-teal-500" /> AI Travel Planner V2
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Generate Your Custom Itinerary
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Tell us your travel style, budget, and interests. Our intelligent engine designs a personalized day-by-day itinerary with budget breakdowns and weather considerations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100 space-y-5">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-600" /> Trip Parameters
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Destination *</label>
              <input
                type="text"
                required
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="e.g. Manali, Goa, Rishikesh, Kashmir..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-semibold focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Days (1–14)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Travel Month</label>
                <select
                  value={form.travelMonth}
                  onChange={(e) => setForm({ ...form, travelMonth: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-bold focus:outline-none focus:border-teal-500"
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Total Budget ($)</label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Travelers Count</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.travelersCount}
                  onChange={(e) => setForm({ ...form, travelersCount: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl p-3 font-bold focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Travel Type</label>
              <div className="flex flex-wrap gap-1.5">
                {travelTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, travelType: type })}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${form.travelType === type ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Interests</label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((opt) => {
                  const selected = form.interests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleInterest(opt)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${selected ? 'bg-slate-900 text-teal-400' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {selected ? '✓ ' : '+ '}{opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-teal-500/25 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Designing Customized Plan...' : 'Generate AI Travel Itinerary'}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {!planResult ? (
            <div className="bg-slate-900 text-white p-12 rounded-3xl border border-slate-800 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-teal-400 mx-auto animate-bounce-short" />
              <h3 className="text-xl font-bold">Your Itinerary Will Appear Here</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Fill out the trip parameters on the left and click "Generate AI Travel Itinerary" to produce your complete day-by-day travel schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Header Summary Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-teal-400 tracking-wider block">Generated Plan</span>
                    <h2 className="text-2xl font-black">{planResult.destination} ({planResult.days} Days)</h2>
                    <p className="text-xs text-slate-300">{planResult.travelType} trip for {planResult.travelersCount} traveler(s)</p>
                  </div>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-teal-300 border border-white/20">
                    {planResult.source}
                  </span>
                </div>

                {/* Budget Breakdown */}
                {planResult.estimatedBudgetBreakdown && (
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/60 text-xs">
                    <div className="bg-slate-800/80 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 block">Total Budget</span>
                      <span className="font-extrabold text-teal-300">${planResult.estimatedBudgetBreakdown.totalBudget}</span>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 block">Per Person</span>
                      <span className="font-extrabold text-white">${planResult.estimatedBudgetBreakdown.perPerson}</span>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 block">Activities</span>
                      <span className="font-extrabold text-emerald-400">${planResult.estimatedBudgetBreakdown.activities}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Day by Day Schedule */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
                <h3 className="font-extrabold text-lg text-slate-900">Day-by-Day Itinerary Schedule</h3>
                <div className="space-y-6">
                  {planResult.itinerary?.map((day) => (
                    <div key={day.dayNumber} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center">
                          {day.dayNumber}
                        </span>
                        {day.title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block text-[10px] uppercase font-bold text-teal-600 mb-1">Morning</strong>
                          {day.morning}
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block text-[10px] uppercase font-bold text-blue-600 mb-1">Afternoon</strong>
                          {day.afternoon}
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block text-[10px] uppercase font-bold text-amber-600 mb-1">Evening</strong>
                          {day.evening}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather & Tips */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
                <h3 className="font-bold text-base text-teal-400 flex items-center gap-2">
                  <Sun className="w-5 h-5" /> Climate & Travel Tips
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{planResult.weatherConsiderations}</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  {planResult.travelTips?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
