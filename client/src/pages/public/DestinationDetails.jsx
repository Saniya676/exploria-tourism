import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { destinationService, weatherService } from '../../services/api';
import WeatherCard from '../../components/cards/WeatherCard';
import PackageCard from '../../components/cards/PackageCard';
import AdventureCard from '../../components/cards/AdventureCard';
import GuideCard from '../../components/cards/GuideCard';
import { MapPin, Calendar, DollarSign, Star, Compass, ArrowLeft, Shield, Sparkles } from 'lucide-react';

export default function DestinationDetails() {
  const { id } = useParams();
  const [dest, setDest] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  async function fetchDetails() {
    try {
      setLoading(true);
      const res = await destinationService.getById(id);
      if (res.success) {
        setDest(res.data);
        const wRes = await weatherService.getWeather(res.data.name);
        if (wRes.success) setWeather(wRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Destination Not Found</h2>
        <Link to="/destinations" className="text-sm font-bold text-teal-600 underline">Back to Destinations</Link>
      </div>
    );
  }

  const activities = Array.isArray(dest.popular_activities) ? dest.popular_activities : [];

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden bg-slate-950 text-white">
        <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover filter brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link to="/destinations" className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-2 border border-slate-700">
            <ArrowLeft className="w-4 h-4" /> All Destinations
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 block">{dest.country_state}</span>
            <h1 className="text-4xl sm:text-6xl font-black">{dest.name}</h1>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> {Number(dest.rating).toFixed(2)} Rating
              </span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-teal-400" /> Best: {dest.best_time}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-emerald-400" /> Avg Budget: ${dest.estimated_budget}</span>
            </div>
          </div>

          <Link
            to="/contact"
            className="px-6 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center gap-2 self-start md:self-end"
          >
            <Sparkles className="w-4 h-4" /> Inquire Special Trip
          </Link>
        </div>
      </div>

      {/* Overview & Live Weather */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Destination Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{dest.description}</p>
            
            <h3 className="text-sm font-bold text-slate-900 pt-3">Popular Activities & Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {activities.map((act, i) => (
                <span key={i} className="text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-200">
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {weather && <WeatherCard weather={weather} />}
        </div>
      </div>

      {/* Adventures in Destination */}
      {dest.adventures && dest.adventures.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Adventures in {dest.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dest.adventures.map((adv) => (
              <AdventureCard key={adv.id} adv={adv} />
            ))}
          </div>
        </section>
      )}

      {/* Packages in Destination */}
      {dest.packages && dest.packages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Recommended Tour Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dest.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* Available Guides */}
      {dest.guides && dest.guides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Verified Local Guides in {dest.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dest.guides.map((g) => (
              <GuideCard key={g.id} guide={g} onConnect={() => {}} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
