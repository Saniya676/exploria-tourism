import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Star, Compass } from 'lucide-react';

export default function DestinationCard({ dest }) {
  const activities = Array.isArray(dest.popular_activities)
    ? dest.popular_activities
    : typeof dest.popular_activities === 'string'
    ? JSON.parse(dest.popular_activities)
    : [];

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <div className="relative h-60 overflow-hidden">
        <img
          src={dest.image_url}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          {Number(dest.rating).toFixed(1)}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-[10px] font-bold tracking-widest uppercase text-teal-300 block mb-0.5">
            {dest.country_state}
          </span>
          <h3 className="text-xl font-extrabold">{dest.name}</h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {dest.description}
        </p>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Best Season:
            </span>
            <span className="font-semibold text-slate-800">{dest.best_time}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Avg Budget:
            </span>
            <span className="font-bold text-slate-900">${dest.estimated_budget}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {activities.slice(0, 3).map((act, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
              {act}
            </span>
          ))}
        </div>

        <Link
          to={`/destinations/${dest.id}`}
          className="w-full py-2.5 bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs rounded-2xl transition text-center shadow-md flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4" />
          Explore Destination
        </Link>
      </div>
    </div>
  );
}
