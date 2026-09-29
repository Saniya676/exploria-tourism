import React from 'react';
import { Compass, ShieldCheck, Award, Heart, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">About Exploria</span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Modernizing Travel & Local Guide Connections
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Exploria was rebuilt from a classic diploma tourism project into a full-stack smart platform that connects adventure enthusiasts with verified local guides, real-time weather, and custom package bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
          <Compass className="w-8 h-8 text-teal-600" />
          <h3 className="text-lg font-bold text-slate-900">Smart Destination Search</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Filter destinations by weather season, budget ranges, and popular high-thrill activity categories.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Intelligent Guide Matching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Matching algorithms pair travelers with indigenous local experts based on area familiarity, languages, and activity ratings.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">End-to-End Reliability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Complete with role-based JWT authentication, admin moderation, and real REST API integrations.</p>
        </div>
      </div>
    </div>
  );
}
