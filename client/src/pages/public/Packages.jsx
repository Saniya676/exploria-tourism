import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { packageService, destinationService } from '../../services/api';
import PackageCard from '../../components/cards/PackageCard';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, Package as PackageIcon } from 'lucide-react';

export default function Packages() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [destinationId, setDestinationId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    fetchData();
  }, [search, destinationId, difficulty, sortBy, maxPrice]);

  async function fetchData() {
    try {
      setLoading(true);
      const [pRes, dRes] = await Promise.all([
        packageService.getAll({ search, destinationId, difficulty, sortBy, maxPrice }),
        destinationService.getAll()
      ]);
      if (pRes.success) setPackages(pRes.data);
      if (dRes.success) setDestinations(dRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <PackageIcon className="w-4 h-4" /> Adventure Packages
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Handcrafted Tour Expeditions
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Filter by difficulty, duration, and price. All packages include certified local guides, hotel/camp stays, and permits.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:border-teal-500 font-semibold"
          >
            <option value="">All Destinations</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:border-teal-500 font-semibold"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
            <option value="Extreme">Extreme</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:border-teal-500 font-semibold"
          >
            <option value="">Sort By Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <p className="text-base font-bold text-slate-700">No packages found</p>
          <button onClick={() => { setSearch(''); setDestinationId(''); setDifficulty(''); setSortBy(''); }} className="text-xs text-teal-600 font-bold underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
