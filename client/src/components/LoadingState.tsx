import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, IndianRupee, Calendar, Compass, PlaneTakeoff, Navigation } from 'lucide-react';

interface LoadingStateProps {
  destination?: string;
}

const steps = [
  { text: 'Checking best routes and transport fares...', icon: Compass, color: 'text-orange-600', bg: 'bg-orange-100' },
  { text: 'Selecting verified stays within your target budget...', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { text: 'Sequencing famous sights and regional food spots...', icon: MapPin, color: 'text-teal-700', bg: 'bg-teal-100' },
  { text: 'Structuring day-by-day morning-to-evening flow...', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100' },
  { text: 'Polishing your complete personalized itinerary...', icon: Sparkles, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ destination }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const currentStep = steps[currentStepIndex];
  const Icon = currentStep.icon;
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="card bg-base-100 shadow-2xl border border-base-200/90 p-8 sm:p-14 text-center max-w-lg mx-auto my-8 rounded-3xl relative overflow-hidden animate-fade-in-up">
      {/* Decorative top sunset bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-teal-500" />

      {/* Playful Animated Plane & Route Icon */}
      <div className="relative mx-auto mb-8 w-24 h-24 flex items-center justify-center">
        {/* Pulsing beacon circles */}
        <div className="absolute inset-0 rounded-3xl bg-orange-500/15 animate-ping" />
        <div className="absolute -inset-2 rounded-3xl bg-teal-500/10 animate-pulse-glow" />

        {/* Central main icon */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/25">
          <PlaneTakeoff className="w-10 h-10 animate-float-slow" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-200 text-base-content/75 text-xs font-bold uppercase tracking-wider mb-2">
        <Navigation className="w-3.5 h-3.5 text-primary animate-spin" />
        <span>Building Your Travel Plan</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black text-base-content mb-3 tracking-tight">
        {destination ? `Crafting Itinerary for ${destination}` : 'Assembling Your Custom Journey'}
      </h3>

      {/* Rotating step phrase with smooth cross-fade transition */}
      <div className="h-14 flex items-center justify-center mb-6 px-4">
        <div
          key={currentStepIndex}
          className="flex items-center gap-2.5 bg-base-200/70 border border-base-300/60 px-4 py-2 rounded-2xl animate-fade-in-up"
        >
          <div className={`w-7 h-7 rounded-xl ${currentStep.bg} ${currentStep.color} flex items-center justify-center shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-base-content text-left">
            {currentStep.text}
          </span>
        </div>
      </div>

      {/* Progress meter with tabular numbers */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-extrabold text-base-content/60 px-1">
          <span>Itinerary Progress</span>
          <span className="tabular-nums text-primary font-black">{progressPercent}%</span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden p-0.5 border border-base-300/40">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-400 to-teal-500 h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-base-content/60 font-medium leading-relaxed">
        Balancing intercity transit, lodging, regional dining, and activities against your budget in INR.
      </p>
    </div>
  );
};
