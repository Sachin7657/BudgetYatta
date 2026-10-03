import React from 'react';
import type { Trip } from '../types/trip';
import {
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../lib/formatters';

interface TripCardProps {
  trip: Trip;
}

function getDestinationGradient(name: string): string {
  const gradients = [
    'from-orange-500 via-rose-500 to-amber-600',
    'from-teal-600 via-cyan-600 to-emerald-600',
    'from-amber-500 via-orange-600 to-red-600',
    'from-indigo-600 via-purple-600 to-pink-600',
    'from-blue-600 via-teal-500 to-emerald-500',
    'from-rose-500 via-orange-500 to-amber-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const formattedDate = new Date(trip.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const isUnderBudget = trip.totalEstimatedCost <= trip.budget;
  const gradientClass = getDestinationGradient(trip.destination);

  return (
    <div className="card bg-base-100 border border-base-200/90 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
      {/* Destination banner */}
      <div className={`relative h-28 bg-gradient-to-r ${gradientClass} p-4 flex flex-col justify-between text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between relative z-10">
          <div className="badge badge-sm bg-black/30 backdrop-blur-md border-0 text-white font-bold px-2.5 py-2 rounded-lg text-[11px] gap-1">
            <Calendar className="w-3 h-3" />
            <span>{trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}</span>
          </div>

          <div className="badge badge-sm bg-black/25 backdrop-blur-md border-0 text-white/90 font-medium px-2 py-1.5 rounded-lg text-[10px]">
            {trip.accommodation || 'Stay Planned'}
          </div>
        </div>

        {/* Route: Origin -> Destination */}
        <div className="relative z-10">
          {trip.origin ? (
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold mb-0.5 truncate">
              <span>{trip.origin}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
              <span className="font-bold text-white">{trip.destination}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-white font-bold text-lg tracking-tight truncate">
              <MapPin className="w-4 h-4 shrink-0 text-white/80" />
              <span>{trip.destination}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-base-content/60 font-semibold">
            <span>Planned on {formattedDate}</span>
            <span className="badge badge-xs bg-base-200 text-base-content/70 font-bold uppercase">
              {trip.travelStyle || 'Budget'}
            </span>
          </div>

          {/* Trip Summary */}
          <p className="text-xs text-base-content/75 line-clamp-2 leading-relaxed font-normal">
            {trip.itinerary.tripSummary}
          </p>

          {/* Specs Badges */}
          <div className="flex flex-wrap gap-1.5 text-xs pt-1">
            <span className="badge badge-sm bg-base-200/80 border-base-300/60 gap-1 py-2 font-medium">
              <Users className="w-3 h-3 text-primary" />
              {trip.travellers} {trip.travellers === 1 ? 'Person' : 'People'}
            </span>
            {trip.transportMode && (
              <span className="badge badge-sm bg-base-200/80 border-base-300/60 gap-1 py-2 font-medium">
                <ArrowRightLeft className="w-3 h-3 text-teal-600" />
                {trip.transportMode}
              </span>
            )}
            <span className="badge badge-sm bg-base-200/80 border-base-300/60 gap-1 py-2 font-medium">
              <Building className="w-3 h-3 text-amber-600" />
              {trip.accommodation}
            </span>
          </div>

          {/* Interests Chips */}
          <div className="flex flex-wrap gap-1 pt-1">
            {trip.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="badge badge-xs bg-orange-50 border-orange-200 text-orange-700 font-semibold px-2 py-1.5 text-[10px]"
              >
                {interest}
              </span>
            ))}
            {trip.interests.length > 3 && (
              <span className="badge badge-xs bg-base-200 text-base-content/60 font-bold px-1.5 py-1 text-[10px]">
                +{trip.interests.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Financials & View Action */}
        <div className="pt-4 border-t border-base-200/80 flex items-center justify-between gap-2 mt-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-base-content/50 block">
              Estimated Total
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-base-content tabular-nums">
                {formatINR(trip.totalEstimatedCost)}
              </span>
              <span className="text-[11px] text-base-content/50 tabular-nums">
                / {formatINR(trip.budget)}
              </span>
              {isUnderBudget ? (
                <span title="Within Budget" className="inline-flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              ) : (
                <span title="Exceeds Budget" className="inline-flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/trips/${trip._id}`}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-1 group-hover:scale-103 transition-transform text-white min-h-[38px] px-3.5"
          >
            <span>View Plan</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
