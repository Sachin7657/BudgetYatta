import React from 'react';
import type { DayPlan } from '../types/trip';
import { MapPin, Activity, Utensils, IndianRupee } from 'lucide-react';

interface ItineraryDayCardProps {
  day: DayPlan;
  isLast?: boolean;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day, isLast }) => {
  return (
    <div className="relative flex gap-4 sm:gap-7 group">
      {/* Vertical timeline node & connecting dotted line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex flex-col items-center justify-center font-black shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 leading-none">
            Day
          </span>
          <span className="text-base sm:text-lg font-black leading-tight tabular-nums">
            {day.day}
          </span>
        </div>
        {!isLast && (
          <div className="w-0.5 flex-grow border-l-2 border-dashed border-orange-300/60 my-2 group-hover:border-orange-500 transition-colors" />
        )}
      </div>

      {/* Day Content Card */}
      <div className="card bg-base-100 border border-base-200/90 shadow-sm hover:shadow-lg transition-all duration-300 p-6 sm:p-7 rounded-3xl w-full mb-8 space-y-5">
        {/* Header with Title and Day Cost */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-base-200/80 gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-primary">
              Scheduled Highlights
            </span>
            <h4 className="text-lg sm:text-xl font-black text-base-content leading-snug">
              {day.title}
            </h4>
          </div>

          <div className="badge badge-lg bg-orange-50 border border-orange-200 text-orange-700 font-black text-xs py-3 px-3.5 rounded-xl self-start sm:self-auto gap-1 tabular-nums shadow-2xs">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Day Est: ₹{day.approximateCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 3 Columns: Places, Activities, Food */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Places to Visit */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-700">
              <span className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-orange-600" />
              </span>
              <span>Places to Visit</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-base-content/85">
              {day.places.map((place, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-base-200/40 p-2.5 rounded-xl border border-base-200/60 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <span>{place}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities & Highlights */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-700">
              <span className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center">
                <Activity className="w-3 h-3 text-teal-700" />
              </span>
              <span>Things to Experience</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-base-content/85">
              {day.activities.map((act, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-base-200/40 p-2.5 rounded-xl border border-base-200/60 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Food & Local Flavors */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700">
              <span className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
                <Utensils className="w-3 h-3 text-amber-700" />
              </span>
              <span>Local Food Culture</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-base-content/85">
              {day.foodExperiences.map((food, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-base-200/40 p-2.5 rounded-xl border border-base-200/60 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
