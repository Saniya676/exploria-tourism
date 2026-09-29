import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationService, packageService, guideService, weatherService } from '../../services/api';
import DestinationCard from '../../components/cards/DestinationCard';
import PackageCard from '../../components/cards/PackageCard';
import GuideCard from '../../components/cards/GuideCard';
import WeatherCard from '../../components/cards/WeatherCard';
import {
  Compass,
  Search,
  Sparkles,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Sun,
  Flame,
  ChevronRight,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  // Guide Match Modal
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
    fetchHomeData();
  }, []);

  async function fetchHomeData() {
    try {
      setLoading(true);
      const [dRes, pRes, gRes, wRes] = await Promise.all([
        destinationService.getAll({ featured: 'true' }),
        packageService.getAll({ featured: 'true' }),
        guideService.getAll(),
        weatherService.getWeather('Manali')
      ]);

      if (dRes.success) setDestinations(dRes.data.slice(0, 4));
      if (pRes.success) setPackages(pRes.data.slice(0, 3));
      if (gRes.success) setGuides(gRes.data.slice(0, 3));
      if (wRes.success) setWeather(wRes.data);
    } catch (err) {
      console.error('Home data load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/packages');
    }
  }

  async function handleGuideMatchSubmit(e) {
    e.preventDefault();
    setMatching(true);
    try {
      const res = await guideService.match(matchForm);
      if (res.success) {
        setMatchedResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMatching(false);
    }
  }

  const adventureCategories = [
    { name: 'Trekking', icon: '🥾', desc: 'High-altitude Himalayan trails', count: '24 Packages' },
    { name: 'Scuba Diving', icon: '🤿', desc: 'Coral reef underwater exploration', count: '18 Expeditions' },
    { name: 'Rafting', icon: '🚣', desc: 'Grade IV white water rapids', count: '15 Trips' },
    { name: 'Paragliding', icon: '🪂', desc: 'Tandem aerial valley flights', count: '12 Flights' },
    { name: 'Bungee Jumping', icon: '🧗', desc: '83m cliff jump adrenaline thrill', count: '8 Jumps' },
    { name: 'Camping', icon: '⛺', desc: 'Overnight alpine & desert camps', count: '30 Camps' }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white pt-10">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
            alt="Exploria Hero Mountains"
            className="w-full h-full object-cover object-center filter brightness-75 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-400/40 backdrop-blur-md text-teal-300 text-xs font-bold uppercase tracking-widest shadow-xl">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Exploria 2.0 – Smart Tourism & Guide Matching
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15]">
            Discover Your Next <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
              Unforgettable Adventure
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore handpicked mountain treks, tropical scuba diving, white-water rafting, and connect with certified local guides with real-time weather forecasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/destinations"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 text-sm transition-all hover:scale-105"
            >
              <Compass className="w-5 h-5" />
              Explore Destinations
            </Link>

            <Link
              to="/packages"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700/80 backdrop-blur-md flex items-center justify-center gap-2 text-sm transition-all hover:border-teal-400/50"
            >
              <Flame className="w-5 h-5 text-amber-400" />
              Explore Adventure Packages
            </Link>
          </div>

          {/* 2. SEARCH BAR OVERLAY */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-slate-900/90 border border-slate-700/80 p-3 sm:p-4 rounded-3xl backdrop-blur-xl shadow-2xl max-w-3xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div className="sm:col-span-2 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search destination, trek, scuba, rafting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-white text-sm rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-2xl transition shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Platform
            </button>
          </form>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">Handpicked Places</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Destinations</h2>
          </div>
          <Link to="/destinations" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-3 sm:mt-0">
            View All 10+ Destinations <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))}
          </div>
        )}
      </section>

      {/* 4. POPULAR PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">Top Rated Packages</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Popular Adventure Packages</h2>
          </div>
          <Link to="/packages" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-3 sm:mt-0">
            Explore All Packages <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </section>

      {/* 5. ADVENTURE CATEGORIES */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">Thrill Categories</span>
            <h2 className="text-3xl font-extrabold">Explore By Adventure Type</h2>
            <p className="text-slate-400 text-sm mt-2">Whether you prefer high peak treks or underwater dives, Exploria has you covered.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {adventureCategories.map((cat, i) => (
              <Link
                key={i}
                to={`/adventures?category=${encodeURIComponent(cat.name)}`}
                className="group bg-slate-800/80 hover:bg-teal-600/20 border border-slate-700/80 hover:border-teal-500/50 p-5 rounded-3xl text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                <p className="text-[10px] text-teal-400 mt-1 font-semibold">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WEATHER PREVIEW & GUIDE MATCH PROMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            {weather ? (
              <WeatherCard weather={weather} />
            ) : (
              <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
            )}
          </div>

          <div className="lg:col-span-7 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-300" />
              Smart Match Engine
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Connect With Certified Local Guides Matched To Your Trip
            </h2>

            <p className="text-sm text-teal-50 max-w-lg leading-relaxed">
              Our intelligent guide matching algorithm pairs you with verified local mountain experts, scuba dive masters, and rafting instructors tailored to your budget and interests.
            </p>

            <button
              onClick={() => setMatchModalOpen(true)}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-xl transition inline-flex items-center gap-2"
            >
              Match Suitable Local Guide <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. FEATURED GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">Local Experts</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Featured Local Guides</h2>
          </div>
          <Link to="/guides" className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-3 sm:mt-0">
            View All Verified Guides <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

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
      </section>

      {/* 8. WHY CHOOSE EXPLORIA */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">Platform Values</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Why Travel With Exploria?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Verified Safety Protocols</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All high-altitude treks and water sports are managed by certified guides equipped with first-aid, satellite oxygen, and insurance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Live Weather Radar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get real-time temperature, wind speed, and precipitation alerts for every destination before you pack your bags.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Authentic Local Insights</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skip tourist traps. Connect directly with indigenous local guides who know secret camera spots and local cuisine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GUIDE MATCHING MODAL */}
      {matchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-teal-400">
                <Sparkles className="w-5 h-5" />
                Find Suitable Guide Match
              </h3>
              <button
                onClick={() => {
                  setMatchModalOpen(false);
                  setMatchedResults(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {!matchedResults ? (
              <form onSubmit={handleGuideMatchSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Destination</label>
                  <input
                    type="text"
                    value={matchForm.destination}
                    onChange={(e) => setMatchForm({ ...matchForm, destination: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Manali, Goa, Rishikesh..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Activities</label>
                  <input
                    type="text"
                    value={matchForm.preferredActivities}
                    onChange={(e) => setMatchForm({ ...matchForm, preferredActivities: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Trekking, Scuba Diving, Rafting..."
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
                  {matching ? 'Running Matching Algorithm...' : 'Find Matching Guides'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-300">Matching Results ({matchedResults.length})</h4>
                <div className="space-y-3">
                  {matchedResults.map((g) => (
                    <GuideCard key={g.id} guide={g} onConnect={() => navigate('/contact')} />
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
