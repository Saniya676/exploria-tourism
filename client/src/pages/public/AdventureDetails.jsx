import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adventureService } from '../../services/api';
import PackageCard from '../../components/cards/PackageCard';
import GuideCard from '../../components/cards/GuideCard';
import { Flame, Clock, MapPin, ShieldCheck, Wrench, ArrowLeft, Sparkles } from 'lucide-react';

export default function AdventureDetails() {
  const { id } = useParams();
  const [adv, setAdv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdventure();
  }, [id]);

  async function fetchAdventure() {
    try {
      setLoading(true);
      const res = await adventureService.getById(id);
      if (res.success) setAdv(res.data);
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

  if (!adv) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Adventure Not Found</h2>
        <Link to="/adventures" className="text-sm font-bold text-teal-600 underline">Back to Adventures</Link>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-12">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden bg-slate-950 text-white">
        <img src={adv.image_url} alt={adv.name} className="w-full h-full object-cover filter brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link to="/adventures" className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-2 border border-slate-700">
            <ArrowLeft className="w-4 h-4" /> All Adventures
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="space-y-2">
            <span className="bg-teal-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">{adv.category}</span>
            <h1 className="text-4xl sm:text-6xl font-black">{adv.name}</h1>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-teal-400" /> {adv.destination_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-teal-400" /> {adv.duration}</span>
              <span>•</span>
              <span className="font-bold text-amber-400">Difficulty: {adv.difficulty}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Activity Fee</span>
            <div className="text-3xl font-extrabold text-white">${adv.price}</div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Activity Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{adv.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3">
              <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Safety Guidelines
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{adv.safety_info}</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-600" /> Required Equipment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{adv.required_equipment}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-8 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-xl font-bold">Ready to Experience This?</h3>
            <p className="text-xs text-teal-50 leading-relaxed">Book a complete package including this adventure or connect with an instructor guide.</p>
            <Link to="/packages" className="w-full block text-center py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-md">
              View Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
