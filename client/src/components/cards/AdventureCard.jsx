import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';

export default function AdventureCard({ adv }) {
  const difficultyBadges = {
    Easy: 'bg-emerald-500/10 text-emerald-600',
    Moderate: 'bg-amber-500/10 text-amber-600',
    Hard: 'bg-rose-500/10 text-rose-600',
    Extreme: 'bg-purple-500/10 text-purple-600'
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={adv.image_url}
          alt={adv.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        <span className="absolute top-4 left-4 bg-teal-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
          {adv.category}
        </span>

        <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          {adv.destination_name}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${difficultyBadges[adv.difficulty]}`}>
              {adv.difficulty}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              {adv.duration}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
            {adv.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {adv.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Activity Fee</span>
            <span className="text-lg font-extrabold text-slate-900">${adv.price}</span>
          </div>

          <Link
            to={`/adventures/${adv.id}`}
            className="px-3.5 py-2 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
