import React from 'react';
import { Compass, Sparkles, Heart, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200/60 border-t border-base-300/60 mt-auto pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-base-content">
                BudgetYatta
              </span>
            </div>

            <p className="text-sm text-base-content/70 max-w-sm leading-relaxed font-normal">
              Practical day-by-day travel planning and budget optimization for Indian domestic travellers. Wander with excitement, spend with confidence.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Realistic Round-Trip Indian Rupee (₹) Estimates</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-base-content/90">
              Explorer Links
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-base-content/70">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Create Itinerary</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  <span>Saved Itineraries</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Traveller Notice */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-base-content/90 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-primary" />
              <span>Fare Disclaimer</span>
            </h4>
            <p className="text-xs text-base-content/65 leading-relaxed">
              Transit, lodging, and meal figures are approximate guidelines based on seasonal averages. Always check live train (IRCTC), bus, or flight ticket rates before finalizing your bookings.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-base-300/60 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-3">
          <p>© {new Date().getFullYear()} BudgetYatta — Travel smarter, wander further.</p>
          <p className="flex items-center gap-1 font-medium">
            Designed for budget-smart explorers with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> and <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
