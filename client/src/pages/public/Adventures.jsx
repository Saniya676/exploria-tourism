import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adventureService } from '../../services/api';
import AdventureCard from '../../components/cards/AdventureCard';
import { Flame, Search } from 'lucide-react';

export default function Adventures() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    fetchAdventures();
  }, [search, category]);

  async function fetchAdventures() {
    try {
      setLoading(true);
      const res = await adventureService.getAll({ search, category });
      if (res.success) setAdventures(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['Trekking', 'Scuba Diving', 'Rafting', 'Paragliding', 'Bungee Jumping', 'Camping'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <Flame className="w-4 h-4 text-amber-500" /> Thrill Expeditions
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Outdoor Adventures & Sports
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From extreme bungee jumping over river cliffs to high peak Himalayan crossover treks.
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search adventure name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${!category ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${category === cat ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : adventures.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-sm font-bold text-slate-700">No adventures found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adventures.map((adv) => (
            <AdventureCard key={adv.id} adv={adv} />
          ))}
        </div>
      )}
    </div>
  );
}
