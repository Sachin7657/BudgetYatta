import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlannerForm } from '../components/PlannerForm';
import { LoadingState } from '../components/LoadingState';
import { ErrorAlert } from '../components/ErrorAlert';
import type { PlannerFormData } from '../schemas/trip.schema';
import { api } from '../lib/api';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Coins,
  ArrowRight,
  Route,
  CheckCircle2,
  CalendarCheck,
  WalletCards,
  PlaneTakeoff,
  Luggage,
} from 'lucide-react';
import { RouteCurvedLine, PassportStamp } from '../components/ui/RouteIllustration';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const plannerSectionRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (data: PlannerFormData) => {
    setIsLoading(true);
    setLoadingDestination(data.destination);
    setError(null);

    // Scroll the planner section into view smoothly — prevents layout-shift scroll jump
    plannerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const createdTrip = await api.createTrip(data);
      navigate(`/trips/${createdTrip._id}`);
    } catch (err: any) {
      console.error('Failed to generate trip:', err);
      setError(
        err?.message ||
          'We could not generate your trip plan right now. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* Hero Section with Warm Sunset Mesh and SVG route decoration */}
      <section className="relative pt-12 pb-10 sm:pt-20 sm:pb-16 bg-wanderlust-mesh border-b border-base-200/80">
        {/* Subtle decorative background curves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <RouteCurvedLine className="text-orange-400 absolute top-12 left-0 w-full" />
          <div className="absolute top-20 right-10 sm:right-24 opacity-30 animate-float-slow">
            <PlaneTakeoff className="w-16 h-16 text-teal-700" />
          </div>
          <div className="absolute bottom-6 left-6 sm:left-20 opacity-30 animate-pulse-glow">
            <Luggage className="w-12 h-12 text-amber-600" />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-extrabold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
            <span>Smart Indian Travel Itinerary & Rupee Budgeting</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-base-content tracking-tight leading-[1.1]">
            Plan Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-teal-700">
              Travel Better.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-base-content/75 font-normal leading-relaxed">
            Generate realistic day-by-day itineraries tailored directly to your origin, destination, and budget in INR (₹).
            No guesswork, no overspending, just pure wanderlust with total financial confidence.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-base-content/70">
            <span className="flex items-center gap-1.5 bg-base-100/90 border border-base-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Categorized Expense Breakdown
            </span>
            <span className="flex items-center gap-1.5 bg-base-100/90 border border-base-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <MapPin className="w-4 h-4 text-orange-600" />
              Geo-Sequenced Daily Stops
            </span>
            <span className="flex items-center gap-1.5 bg-base-100/90 border border-base-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <Coins className="w-4 h-4 text-amber-600" />
              Round-Trip Transit Included
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Planner Section */}
      {/* Both PlannerForm and LoadingState are always rendered — toggled with CSS only.
          This keeps page height stable and prevents scroll-jump on state change. */}
      <section ref={plannerSectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* LoadingState: visible while loading, hidden (but present in DOM) otherwise */}
        <div className={isLoading ? 'block' : 'hidden'}>
          <LoadingState destination={loadingDestination} />
        </div>

        {/* PlannerForm: hidden while loading so page height stays constant */}
        <div className={isLoading ? 'hidden' : 'block'}>
          <PlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
      </section>

      {/* Static Section 1: How It Works in 3 Simple Steps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200/80 mb-2">
            <Route className="w-3.5 h-3.5" />
            <span>Frictionless Journey Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
            How BudgetYatta Works
          </h2>
          <p className="text-sm text-base-content/65 mt-2 font-medium">
            From empty idea to a fully scheduled, budget-protected trip in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="card bg-base-100 border border-base-200/90 shadow-sm p-7 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="text-5xl font-black text-base-200/80 absolute top-4 right-4 pointer-events-none select-none group-hover:text-orange-500/10 transition-colors">
              01
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black mb-5 shadow-xs">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-base-content mb-2">
              1. Choose Origin & Bounds
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
              Specify your starting city, destination, travel party size, and total group budget in INR. Select your preferred transport and stay vibe.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card bg-base-100 border border-base-200/90 shadow-sm p-7 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="text-5xl font-black text-base-200/80 absolute top-4 right-4 pointer-events-none select-none group-hover:text-teal-700/10 transition-colors">
              02
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black mb-5 shadow-xs">
              <WalletCards className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-base-content mb-2">
              2. Realistic Rupee Allocation
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
              We calculate round-trip train/bus/flight fares, room requirements, local transit, and dining, preventing surprise mid-trip shortfalls.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card bg-base-100 border border-base-200/90 shadow-sm p-7 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="text-5xl font-black text-base-200/80 absolute top-4 right-4 pointer-events-none select-none group-hover:text-amber-600/10 transition-colors">
              03
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-5 shadow-xs">
              <Route className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-base-content mb-2">
              3. Day-by-Day Journey Flow
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed font-medium">
              Day 1 begins with departure transit from your home city; the last day returns you home. Every day includes places, food tips, and costs.
            </p>
          </div>
        </div>
      </section>

      {/* Static Section 2: What You Get / Pillars of Trust */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-orange-50 via-amber-50 to-teal-50 border border-orange-200/70 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-700 bg-orange-100/80 px-3 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                <span>Traveler Control Guarantee</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
                No Unrealistic Itineraries. No Blind Costs.
              </h2>
              <p className="text-sm sm:text-base text-base-content/75 leading-relaxed font-normal">
                Generic travel blogs list endless places that are geographically impossible to visit in a day. BudgetYatta sequences stops logically and assigns transparent approximate costs to every day.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-base-content/85">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Real Indian Rupee (₹) breakdown covering intercity travel and stay</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-base-content/85">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Saved in your trip history — revisit your plans anytime</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-base-content/85">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Clean printable layout for physical day-pack reference</span>
                </div>
              </div>
            </div>

            {/* Visual Passport Card */}
            <div className="flex justify-center">
              <div className="card bg-base-100 border border-base-300 shadow-xl p-6 rounded-3xl max-w-sm w-full space-y-4 rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-base-200">
                  <span className="font-extrabold text-sm text-primary flex items-center gap-1.5">
                    BudgetYatta Certified
                  </span>
                  <PassportStamp text="READY TO GO" subtext="INR VERIFIED" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-base-100">
                    <span className="text-base-content/60 font-semibold">Typical Savings:</span>
                    <span className="font-black text-emerald-600">15% - 25% on average</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-base-100">
                    <span className="text-base-content/60 font-semibold">Planning Time:</span>
                    <span className="font-black text-base-content">Under 1 Minute</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-base-100">
                    <span className="text-base-content/60 font-semibold">Food & Sight Sequencing:</span>
                    <span className="font-black text-base-content">Authentic Regional</span>
                  </div>
                </div>
                <Link
                  to="/trips"
                  className="btn btn-outline btn-primary btn-sm w-full rounded-xl font-bold gap-1 mt-2"
                >
                  <span>Explore Saved Itineraries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
