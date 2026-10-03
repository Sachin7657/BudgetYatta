import React from 'react';
import type { Trip } from '../types/trip';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Building,
  ArrowLeft,
  Printer,
  ArrowRight,
  Train,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PassportStamp } from './ui/RouteIllustration';
import { formatINR } from '../lib/formatters';

interface TripHeaderProps {
  trip: Trip;
}

export const TripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          to="/trips"
          className="btn btn-ghost btn-sm gap-2 text-base-content/75 hover:text-base-content font-bold pl-0 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Back to Saved Trips</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="badge badge-success badge-sm gap-1.5 text-white font-extrabold py-3 px-3.5 rounded-xl shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Budget Verified
          </span>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-sm btn-outline rounded-xl font-bold gap-2 border-base-300 hover:bg-base-200 min-h-[40px] px-3.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-base-content" />
            <span>Print Itinerary</span>
          </button>
        </div>
      </div>

      {/* Main Destination Hero Banner Card */}
      <div className="card bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-teal-500/10 border border-orange-200/80 p-6 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 opacity-90 hidden sm:block">
          <PassportStamp text="ROUND-TRIP ROUTE" subtext="ALL DAYS BALANCED" />
        </div>

        <div className="max-w-3xl space-y-4">
          {/* Origin -> Destination Route Badge */}
          {trip.origin ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100/90 text-orange-900 text-xs font-black uppercase tracking-wider">
              <span>{trip.origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>{trip.destination}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
              <span className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center">
                <MapPin className="w-3 h-3" />
              </span>
              <span>Destination Itinerary</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-black text-base-content tracking-tight">
            {trip.destination}
          </h1>

          <p className="text-base-content/80 text-sm sm:text-base leading-relaxed font-normal">
            {trip.itinerary.tripSummary}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs sm:text-sm pt-2">
            <div className="flex items-center gap-2 bg-base-100/95 border border-base-200/90 px-3.5 py-2 rounded-2xl shadow-2xs font-bold text-base-content">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>{trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}</span>
            </div>

            <div className="flex items-center gap-2 bg-base-100/95 border border-base-200/90 px-3.5 py-2 rounded-2xl shadow-2xs font-bold text-base-content">
              <Users className="w-4 h-4 text-teal-700" />
              <span>{trip.travellers} {trip.travellers === 1 ? 'Traveller' : 'Travellers'}</span>
            </div>

            <div className="flex items-center gap-2 bg-base-100/95 border border-base-200/90 px-3.5 py-2 rounded-2xl shadow-2xs font-bold text-base-content">
              <Wallet className="w-4 h-4 text-amber-600" />
              <span className="tabular-nums">Target: {formatINR(trip.budget)}</span>
            </div>

            <div className="flex items-center gap-2 bg-base-100/95 border border-base-200/90 px-3.5 py-2 rounded-2xl shadow-2xs font-bold text-base-content">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>{trip.accommodation} Style</span>
            </div>

            {trip.transportMode && (
              <div className="flex items-center gap-2 bg-base-100/95 border border-base-200/90 px-3.5 py-2 rounded-2xl shadow-2xs font-bold text-base-content">
                <Train className="w-4 h-4 text-primary" />
                <span>{trip.transportMode} Transit</span>
              </div>
            )}
          </div>

          {/* Interests Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-orange-200/60">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60 mr-1">
              Curated For:
            </span>
            {trip.interests.map((interest) => (
              <span
                key={interest}
                className="badge badge-sm bg-base-100 border border-orange-200/80 text-orange-800 font-bold px-2.5 py-2 rounded-lg text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
