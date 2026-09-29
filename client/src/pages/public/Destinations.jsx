import React, { useState, useEffect } from 'react';
import { destinationService } from '../../services/api';
import DestinationCard from '../../components/cards/DestinationCard';
import InteractiveMap from '../../components/common/InteractiveMap';
import { Search, Filter, SlidersHorizontal, Compass, Grid, MapPin } from 'lucide-react';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  useEffect(() => {
    fetchDestinations();
  }, [search, maxPrice]);

  async function fetchDestinations() {
    try {
      setLoading(true);
      const res = await destinationService.getAll({ search, maxPrice });
      if (res.success) {
        setDestinations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <Compass className="w-4 h-4" /> Destination Discovery
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore World-Class Destinations
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From snowy Himalayan peaks to tropical azure oceans, browse authentic travel hubs with real-time weather and budget estimations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search destination, state, activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end flex-wrap">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${viewMode === 'map' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <MapPin className="w-3.5 h-3.5" /> Map View
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            <span>Max Budget: <strong>${maxPrice}</strong></span>
          </div>
          <input
            type="range"
            min="200"
            max="1000"
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-32 accent-teal-600"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <p className="text-base font-bold text-slate-700">No destinations found matching filters</p>
          <button onClick={() => { setSearch(''); setMaxPrice(1000); }} className="text-xs text-teal-600 font-bold underline">Reset Filters</button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap destinations={destinations} height="550px" zoom={5} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      )}
    </div>
  );
}
