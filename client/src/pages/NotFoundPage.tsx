import React from 'react';
import { Compass, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PassportStamp } from '../components/ui/RouteIllustration';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4 space-y-7 animate-fade-in-up">
      {/* Decorative compass icon with beacon */}
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-orange-500/10 animate-ping" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-500 to-teal-600 text-white flex items-center justify-center shadow-xl shadow-orange-600/20">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
      </div>

      <div className="space-y-2">
        <PassportStamp text="ROUTE OFF-GRID" subtext="DETOUR DETECTED" />
        <h1 className="text-5xl font-black text-base-content tracking-tight mt-3">404</h1>
        <h2 className="text-xl font-black text-base-content/85">
          Destination Detour Ahead
        </h2>
        <p className="text-xs sm:text-sm text-base-content/65 max-w-xs mx-auto font-medium leading-relaxed">
          Looks like you wandered off the map! The requested page doesn't exist or has moved.
        </p>
      </div>

      <div>
        <Link
          to="/"
          className="btn btn-primary btn-md rounded-2xl gap-2 font-black shadow-md shadow-orange-600/25 text-white min-h-[48px] px-6"
        >
          <Home className="w-4 h-4" />
          <span>Return to Planner Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
