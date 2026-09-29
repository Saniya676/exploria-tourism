import React, { useState, useEffect } from 'react';
import { guideService } from '../../services/api';
import GuideCard from '../../components/cards/GuideCard';
import { Users, Search, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  // Guide Match State
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchForm, setMatchForm] = useState({
    destination: 'Manali',
    preferredActivities: 'Trekking',
    budget: 500,
    travelersCount: 2
  });
  const [matchedResults, setMatchedResults] = useState(null);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, [search, location]);

  async function fetchGuides() {
    try {
      setLoading(true);
      const res = await guideService.getAll({ search, location });
      if (res.success) setGuides(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGuideMatchSubmit(e) {
    e.preventDefault();
    setMatching(true);
    try {
      const res = await guideService.match(matchForm);
      if (res.success) setMatchedResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatching(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <Users className="w-4 h-4" /> Verified Local Experts
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect With Local Guides
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Hire certified mountain guides, PADI scuba dive masters, and white-water rafting safety leaders with area familiarity.
        </p>

        <button
          onClick={() => setMatchModalOpen(true)}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-500/25 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Launch Intelligent Guide Matcher
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search guide name, language, specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-teal-500"
          />
        </div>

        <input
          type="text"
          placeholder="Filter by location (e.g. Goa, Manali)..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-xs rounded-2xl px-4 py-3 text-slate-800 focus:outline-none focus:border-teal-500 font-semibold"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
          <p className="text-sm font-bold text-slate-700">No guides found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onConnect={() => {
                setMatchModalOpen(true);
                setMatchForm({ ...matchForm, destination: guide.location });
              }}
            />
          ))}
        </div>
      )}

      {/* Guide Match Modal */}
      {matchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-teal-400">
                <Sparkles className="w-5 h-5" /> Guide Matching Algorithm
              </h3>
              <button onClick={() => { setMatchModalOpen(false); setMatchedResults(null); }} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            {!matchedResults ? (
              <form onSubmit={handleGuideMatchSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destination</label>
                  <input
                    type="text"
                    value={matchForm.destination}
                    onChange={(e) => setMatchForm({ ...matchForm, destination: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Activities</label>
                  <input
                    type="text"
                    value={matchForm.preferredActivities}
                    onChange={(e) => setMatchForm({ ...matchForm, preferredActivities: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Budget ($)</label>
                    <input
                      type="number"
                      value={matchForm.budget}
                      onChange={(e) => setMatchForm({ ...matchForm, budget: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Travelers Count</label>
                    <input
                      type="number"
                      value={matchForm.travelersCount}
                      onChange={(e) => setMatchForm({ ...matchForm, travelersCount: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={matching}
                  className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition shadow-lg shadow-teal-500/20"
                >
                  {matching ? 'Matching Guides...' : 'Calculate Guide Matches'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-300">Matches Found ({matchedResults.length})</h4>
                <div className="space-y-3">
                  {matchedResults.map((g) => (
                    <GuideCard key={g.id} guide={g} onConnect={() => setMatchModalOpen(false)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
