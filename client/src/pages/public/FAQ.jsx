import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: 'How does guide matching work on Exploria?', a: 'Our matching algorithm evaluates your target destination, preferred activities, budget, and travel dates against verified local guide profiles, ranking them by match percentage.' },
    { q: 'How are inquiry reference IDs generated?', a: 'Every inquiry submitted generates a unique backend reference ID (e.g. EXP-XXXXXXXX) stored securely in MySQL/SQLite database.' },
    { q: 'Can I check real-time weather for destinations?', a: 'Yes! Exploria integrates OpenWeatherMap API and our climate engine to provide temperature, humidity, and wind speed forecasts.' },
    { q: 'Is demo booking free for testing?', a: 'Yes! The booking flow features a test payment mode labelled DEMO_PAID so you can explore full booking confirmation without charging real cards.' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">Help & Support Center</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <h3 className="font-bold text-base text-slate-900">{faq.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
