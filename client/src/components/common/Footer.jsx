import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Globe, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white">Exploria</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Explore More. Travel Smarter. Next-generation smart tourism & adventure platform matching travelers with authentic destinations, real-time weather, and verified local guides.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition"><Globe className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition"><Mail className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-500 hover:text-white transition"><Shield className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/destinations" className="hover:text-teal-400 transition">Destinations</Link></li>
              <li><Link to="/adventures" className="hover:text-teal-400 transition">Adventures</Link></li>
              <li><Link to="/packages" className="hover:text-teal-400 transition">Tour Packages</Link></li>
              <li><Link to="/guides" className="hover:text-teal-400 transition">Local Guides</Link></li>
              <li><Link to="/weather" className="hover:text-teal-400 transition">Weather Radar</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-teal-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">Contact & Support</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400 transition">Frequently Asked</Link></li>
              <li><Link to="/register" className="hover:text-teal-400 transition">Join as Guide</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-1" />
                <span>Exploria Global HQ, Adventure Hub Road, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>+91 1800-EXPLORIA</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>support@exploria.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Exploria Tourism Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with precision for full-stack excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
