import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSaved } from '../../context/SavedContext';

export default function PackageCard({ pkg }) {
  const { isSaved, toggleFavorite } = useSaved();
  const saved = isSaved(pkg.id);

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Moderate: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    Extreme: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
      {/* Cover Image & Badges */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.cover_image || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000'}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(pkg.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition shadow-md"
        >
          <Heart className={`w-5 h-5 ${saved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {/* Destination Tag */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white font-medium bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>{pkg.destination_name || 'Himalayas'}</span>
        </div>

        {/* Difficulty Badge */}
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${difficultyColors[pkg.difficulty] || difficultyColors.Moderate}`}>
          {pkg.difficulty}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {Number(pkg.rating).toFixed(1)} ({pkg.reviews_count || 0})
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
            {pkg.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {pkg.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starting From</span>
            <span className="text-xl font-extrabold text-slate-900">${pkg.price}</span>
            <span className="text-xs text-slate-500"> / person</span>
          </div>

          <Link
            to={`/packages/${pkg.id}`}
            className="px-4 py-2.5 bg-slate-900 hover:bg-teal-600 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-md group-hover:shadow-teal-500/20"
          >
            Explore <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
