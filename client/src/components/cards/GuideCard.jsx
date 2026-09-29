import React from 'react';
import { Star, MapPin, Award, CheckCircle, Languages, MessageSquare, DollarSign } from 'lucide-react';

export default function GuideCard({ guide, onConnect }) {
  const languages = Array.isArray(guide.languages)
    ? guide.languages
    : typeof guide.languages === 'string'
    ? JSON.parse(guide.languages)
    : [];

  const specializations = Array.isArray(guide.specializations)
    ? guide.specializations
    : typeof guide.specializations === 'string'
    ? JSON.parse(guide.specializations)
    : [];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={guide.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
              alt={guide.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Verified Available" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="truncate">{guide.location}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">{guide.name}</h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {Number(guide.rating || 4.9).toFixed(2)} ({guide.reviews_count || 12})
              </span>

              {guide.matchScore && (
                <span className="text-[10px] font-extrabold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                  {guide.matchScore}% Match
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2.5 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Award className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span><strong>{guide.experience_years || 5}+ Years</strong> Mountaineering & Trail Experience</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Languages className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="truncate">{languages.join(', ')}</span>
          </div>
        </div>

        {/* Specializations Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specializations.map((spec, i) => (
            <span key={i} className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 px-2.5 py-1 rounded-full">
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Rate</span>
          <span className="text-base font-extrabold text-slate-900">${guide.hourly_rate || 25}</span>
          <span className="text-[10px] text-slate-500"> / hr</span>
        </div>

        <button
          onClick={() => onConnect && onConnect(guide)}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Connect Guide
        </button>
      </div>
    </div>
  );
}
