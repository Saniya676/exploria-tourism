import React, { useState, useEffect } from 'react';
import { weatherService } from '../../services/api';
import WeatherCard from '../../components/cards/WeatherCard';
import { Sun, Search, MapPin, Wind, Compass } from 'lucide-react';

export default function WeatherPage() {
  const [city, setCity] = useState('Manali');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const quickCities = ['Manali', 'Goa', 'Rishikesh', 'Leh-Ladakh', 'Kerala', 'Sikkim', 'Andaman', 'Kashmir', 'Jaisalmer'];

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  async function fetchWeather(targetCity) {
    try {
      setLoading(true);
      const res = await weatherService.getWeather(targetCity);
      if (res.success) setWeather(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <Sun className="w-4 h-4 text-amber-500" /> Climate & Weather Intelligence
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Real-Time Travel Weather Radar
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Check live climate conditions, temperature forecasts, and wind alerts for any destination before planning your trip.
        </p>
      </div>

      {/* Search & Quick Chips */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 max-w-3xl mx-auto space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Enter city or destination (e.g. Goa, Leh, Kashmir)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-2xl transition shadow-md"
          >
            Check Weather
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs text-slate-400 font-semibold mr-2">Popular:</span>
          {quickCities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${city.toLowerCase() === c.toLowerCase() ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Display Card */}
      <div className="max-w-3xl mx-auto space-y-8">
        {loading ? (
          <div className="h-72 bg-slate-200 rounded-3xl animate-pulse" />
        ) : (
          <>
            <WeatherCard weather={weather} />

            {/* 5-Day Forecast Grid */}
            {weather?.forecast && weather.forecast.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" /> 5-Day Weather Forecast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weather.forecast.map((dayItem, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 p-4 rounded-2xl text-center space-y-2 shadow-sm hover:border-teal-400 transition"
                    >
                      <p className="text-xs font-bold text-slate-700">{dayItem.day}</p>
                      <p className="text-[10px] text-slate-400">{dayItem.date}</p>
                      <div className="text-2xl py-1">
                        {dayItem.condition === 'Sunny' ? '☀️' : dayItem.condition === 'Rainy' ? '🌧️' : '⛅'}
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        {dayItem.temp_max}° <span className="text-slate-400 font-normal">{dayItem.temp_min}°</span>
                      </div>
                      <p className="text-[10px] text-teal-600 font-semibold truncate">{dayItem.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
