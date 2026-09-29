import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-700/80 relative overflow-hidden">
      {/* Subtle Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">Live Weather Radar</span>
            <h3 className="text-2xl font-black tracking-tight">{weather.city}, {weather.country}</h3>
            <p className="text-xs text-slate-300 mt-0.5 capitalize">{weather.description || weather.condition}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            {weather.icon ? (
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.condition} className="w-12 h-12" />
            ) : (
              <Sun className="w-8 h-8 text-amber-400" />
            )}
          </div>
        </div>

        {/* Temperature Hero */}
        <div className="my-6 flex items-baseline gap-2">
          <span className="text-5xl font-black tracking-tight">{weather.temp}°C</span>
          <span className="text-xs text-slate-400 font-medium">Feels like {weather.feels_like}°C</span>
        </div>

        {/* Climate Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
            <Droplets className="w-4 h-4 text-teal-400 mb-1" />
            <span className="text-[10px] text-slate-400">Humidity</span>
            <span className="font-bold">{weather.humidity}%</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
            <Wind className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[10px] text-slate-400">Wind Speed</span>
            <span className="font-bold">{weather.wind_speed} m/s</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50 flex flex-col items-center text-center">
            <Eye className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-400">Visibility</span>
            <span className="font-bold">{weather.visibility} km</span>
          </div>
        </div>

        {/* Recommendation Banner */}
        {weather.recommendation && (
          <div className="mt-4 p-3.5 bg-teal-500/20 border border-teal-400/40 rounded-2xl text-xs text-teal-200 font-medium flex items-center gap-2.5">
            <span className="text-base">💡</span>
            <span>{weather.recommendation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
