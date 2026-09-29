import React from 'react';
import { useSaved } from '../../context/SavedContext';
import PackageCard from '../../components/cards/PackageCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { savedPackages } = useSaved();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500" /> Saved Favorites
        </h1>
        <p className="text-xs text-slate-600">Your collection of saved tour packages and mountain expeditions.</p>
      </div>

      {savedPackages.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200/80 space-y-2">
          <p className="text-sm font-bold text-slate-700">No saved packages yet</p>
          <p className="text-xs text-slate-500">Click the heart icon on any package card to save it here for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
