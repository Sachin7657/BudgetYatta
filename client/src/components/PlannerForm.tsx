import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { plannerFormSchema, type PlannerFormData } from '../schemas/trip.schema';
import {
  MapPin,
  Calendar,
  Building,
  Sparkles,
  Compass,
  Trees,
  Utensils,
  Landmark,
  BookOpen,
  ShoppingBag,
  Coffee,
  Moon,
  Camera,
  Check,
  Zap,
  Train,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Plane,
  Bus,
  Car,
} from 'lucide-react';
import { PassportStamp } from './ui/RouteIllustration';
import { MAJOR_INDIAN_CITIES } from '../lib/constants';
import { formatINR } from '../lib/formatters';

interface PlannerFormProps {
  onSubmit: (data: PlannerFormData) => Promise<void>;
  isLoading: boolean;
}

const ACCOMMODATION_OPTIONS = [
  { value: 'Hostel', label: 'Hostel / Dorm', desc: 'Social backpacker dorms & beds', badge: 'Saver' },
  { value: 'Budget hotel', label: 'Budget Hotel', desc: 'Clean, verified 2/3-star private rooms', badge: 'Popular' },
  { value: 'Homestay', label: 'Homestay', desc: 'Warm local hospitality & heritage stays', badge: 'Cultural' },
] as const;

const TRAVEL_STYLE_OPTIONS = [
  { value: 'Budget', label: 'Budget Saver', desc: 'Dhabas, sleeper trains & smart saving' },
  { value: 'Comfortable', label: 'Comfortable', desc: 'AC express trains/cabs, cafes & private stays' },
] as const;

const TRANSPORT_MODE_OPTIONS = [
  { value: 'Any', label: 'Any (Best Value)', icon: Sparkles },
  { value: 'Train', label: 'Train', icon: Train },
  { value: 'Bus', label: 'Bus', icon: Bus },
  { value: 'Flight', label: 'Flight', icon: Plane },
  { value: 'Own vehicle', label: 'Own vehicle / Cab', icon: Car },
] as const;

const INTEREST_OPTIONS = [
  { id: 'Adventure', label: 'Adventure', icon: Compass },
  { id: 'Nature', label: 'Nature', icon: Trees },
  { id: 'Food', label: 'Food & Dining', icon: Utensils },
  { id: 'Culture', label: 'Culture & Arts', icon: Landmark },
  { id: 'History', label: 'Heritage', icon: BookOpen },
  { id: 'Shopping', label: 'Local Bazaars', icon: ShoppingBag },
  { id: 'Relaxation', label: 'Chill & Wellness', icon: Coffee },
  { id: 'Nightlife', label: 'Nightlife', icon: Moon },
  { id: 'Photography', label: 'Photography', icon: Camera },
];

const POPULAR_DESTINATIONS = ['Manali', 'Goa', 'Jaipur', 'Kerala', 'Ladakh', 'Varanasi', 'Rishikesh', 'Pondicherry'];
const QUICK_BUDGETS = [15000, 30000, 50000, 90000];

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlannerFormData>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      origin: 'Delhi',
      destination: '',
      duration: 4,
      travellers: 2,
      budget: 35000,
      travelStyle: 'Budget',
      transportMode: 'Any',
      accommodation: 'Budget hotel',
      interests: ['Nature', 'Food'],
      startDateOrMonth: '',
    },
  });

  const selectedInterests = watch('interests') || [];
  const currentBudget = watch('budget');
  const currentOrigin = watch('origin');
  const currentDestination = watch('destination');
  const currentDuration = watch('duration');
  const currentTravellers = watch('travellers');

  // Friendly soft floor calculation for warning hint (non-blocking)
  const roughFloor = Math.max(1, currentTravellers || 1) * Math.max(1, currentDuration || 1) * 1200 + 1500;
  const isBudgetVeryTight = currentBudget > 0 && currentBudget < roughFloor;

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      if (selectedInterests.length > 1) {
        setValue(
          'interests',
          selectedInterests.filter((id) => id !== interestId),
          { shouldValidate: true }
        );
      }
    } else {
      setValue('interests', [...selectedInterests, interestId], { shouldValidate: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card bg-base-100 shadow-xl border border-base-200/90 p-6 sm:p-10 rounded-3xl space-y-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      {/* City Datalists */}
      <datalist id="indian-cities-list">
        {MAJOR_INDIAN_CITIES.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>

      {/* Decorative top accent */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-base-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Zap className="w-3.5 h-3.5 fill-primary" />
            <span>Smart Travel Planner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Design Your Trip
          </h2>
          <p className="text-xs sm:text-sm text-base-content/65 mt-1 font-medium">
            Enter your starting city and destination for realistic round-trip costs and day-by-day sequencing.
          </p>
        </div>

        <div className="hidden sm:block">
          <PassportStamp text="INDIAN RUPEES" subtext="ROUND-TRIP INCLUDED" />
        </div>
      </div>

      {/* SECTION 1: WHERE (Origin and Destination) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Route & Destinations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Origin */}
          <div className="space-y-2">
            <label
              htmlFor="origin"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-base-content"
            >
              <span>Starting From (City)</span>
              <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <input
              id="origin"
              type="text"
              list="indian-cities-list"
              placeholder="e.g. Delhi, Mumbai, Bengaluru"
              disabled={isLoading}
              {...register('origin')}
              className={`input input-bordered w-full h-12 text-sm rounded-2xl transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
                errors.origin ? 'input-error animate-shake-x border-rose-500' : 'border-base-300/80'
              }`}
            />
            {errors.origin && (
              <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
                {errors.origin.message}
              </p>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label
              htmlFor="destination"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-base-content"
            >
              <span>Traveling To (Destination)</span>
              <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <input
              id="destination"
              type="text"
              list="indian-cities-list"
              placeholder="e.g. Manali, Goa, Jaipur"
              disabled={isLoading}
              {...register('destination')}
              className={`input input-bordered w-full h-12 text-sm rounded-2xl transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
                errors.destination ? 'input-error animate-shake-x border-rose-500' : 'border-base-300/80'
              }`}
            />
            {errors.destination && (
              <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
                {errors.destination.message}
              </p>
            )}
          </div>
        </div>

        {/* Popular destination pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mr-1">
            Trending:
          </span>
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest}
              type="button"
              disabled={isLoading}
              onClick={() => setValue('destination', dest, { shouldValidate: true })}
              className="badge badge-sm py-2 px-2.5 rounded-lg border border-base-200 bg-base-200/50 hover:bg-primary hover:text-white hover:border-primary text-base-content/75 font-semibold text-xs transition-all duration-150 cursor-pointer min-h-[28px]"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: TRIP SCOPE & TOTAL GROUP BUDGET */}
      <div className="space-y-4 pt-2 border-t border-base-200/70">
        <h3 className="text-xs font-black uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Duration & Group Budget</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Duration */}
          <div className="space-y-1.5">
            <label
              htmlFor="duration"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-base-content"
            >
              <span>Duration (Days)</span>
              <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <div className="relative">
              <input
                id="duration"
                type="number"
                min={1}
                max={15}
                disabled={isLoading}
                {...register('duration')}
                className={`input input-bordered w-full h-12 rounded-2xl tabular-nums font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
                  errors.duration ? 'input-error animate-shake-x border-rose-500' : 'border-base-300/80'
                }`}
              />
              <span className="absolute right-3.5 top-3.5 text-xs text-base-content/50 font-bold uppercase pointer-events-none">
                Days
              </span>
            </div>
            {errors.duration && (
              <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
                {errors.duration.message}
              </p>
            )}
            <span className="text-[11px] text-base-content/50 font-medium block">
              1 to 15 days
            </span>
          </div>

          {/* Travellers */}
          <div className="space-y-1.5">
            <label
              htmlFor="travellers"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-base-content"
            >
              <span>Travellers</span>
              <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <div className="relative">
              <input
                id="travellers"
                type="number"
                min={1}
                max={10}
                disabled={isLoading}
                {...register('travellers')}
                className={`input input-bordered w-full h-12 rounded-2xl tabular-nums font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
                  errors.travellers ? 'input-error animate-shake-x border-rose-500' : 'border-base-300/80'
                }`}
              />
              <span className="absolute right-3.5 top-3.5 text-xs text-base-content/50 font-bold uppercase pointer-events-none">
                People
              </span>
            </div>
            {errors.travellers && (
              <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
                {errors.travellers.message}
              </p>
            )}
            <span className="text-[11px] text-base-content/50 font-medium block">
              Group size (1 to 10)
            </span>
          </div>

          {/* Total Group Budget */}
          <div className="space-y-1.5">
            <label
              htmlFor="budget"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-base-content"
            >
              <span>Total Group Budget</span>
              <span className="text-rose-500 font-extrabold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-base text-base-content/60 font-black pointer-events-none">
                ₹
              </span>
              <input
                id="budget"
                type="number"
                step={500}
                min={1000}
                disabled={isLoading}
                {...register('budget')}
                className={`input input-bordered w-full h-12 pl-8.5 rounded-2xl tabular-nums font-extrabold text-base focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary ${
                  errors.budget ? 'input-error animate-shake-x border-rose-500' : 'border-base-300/80'
                }`}
              />
            </div>
            {errors.budget && (
              <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
                {errors.budget.message}
              </p>
            )}
            <span className="text-[11px] text-base-content/50 font-medium block">
              Total fund for everyone (round-trip + stay + meals)
            </span>
          </div>
        </div>

        {/* Quick Budget Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
            Quick Select Budget:
          </span>
          {QUICK_BUDGETS.map((amount) => (
            <button
              key={amount}
              type="button"
              disabled={isLoading}
              onClick={() => setValue('budget', amount, { shouldValidate: true })}
              className={`btn btn-xs rounded-lg font-bold tabular-nums transition-all ${
                currentBudget === amount
                  ? 'btn-primary shadow-xs text-white'
                  : 'btn-ghost bg-base-200/60 hover:bg-base-200 text-base-content/75'
              }`}
            >
              {formatINR(amount)}
            </button>
          ))}
        </div>

        {/* Kind, proactive budget tightness feedback notice */}
        {isBudgetVeryTight && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 animate-fade-in-up">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Budget Notice:</span>
              <span>
                {formatINR(currentBudget)} is a very tight budget for {currentDuration} days in{' '}
                {currentDestination || 'your destination'} from {currentOrigin || 'your city'} for{' '}
                {currentTravellers} traveller(s). You can still proceed — we will plan the leanest version and provide concrete suggestions on where to save.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: STAY PREFERENCE (3 Clean Choices) */}
      <div className="space-y-3 pt-2 border-t border-base-200/70">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Building className="w-3.5 h-3.5" />
          </span>
          <span>Stay Style Preference</span>
          <span className="text-rose-500 font-extrabold">*</span>
        </label>

        <Controller
          name="accommodation"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ACCOMMODATION_OPTIONS.map((opt) => {
                const isSelected = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isLoading}
                    onClick={() => field.onChange(opt.value)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 min-h-[85px] cursor-pointer group ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary'
                        : 'border-base-200 hover:border-base-300 hover:bg-base-200/40 text-base-content/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black tracking-tight">{opt.label}</span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-base-content/40 group-hover:text-base-content/60">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-base-content/65 leading-tight font-medium">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.accommodation && (
          <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
            {errors.accommodation.message}
          </p>
        )}
      </div>

      {/* SECTION 4: INTERESTS (Chips) */}
      <div className="space-y-3 pt-2 border-t border-base-200/70">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content">
            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </span>
            <span>What do you love experiencing?</span>
            <span className="text-rose-500 font-extrabold">*</span>
          </label>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {selectedInterests.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-0.5">
          {INTEREST_OPTIONS.map((interest) => {
            const Icon = interest.icon;
            const isSelected = selectedInterests.includes(interest.id);

            return (
              <button
                key={interest.id}
                type="button"
                disabled={isLoading}
                onClick={() => toggleInterest(interest.id)}
                className={`btn btn-sm rounded-xl font-bold transition-all duration-200 min-h-[40px] px-3.5 gap-2 cursor-pointer ${
                  isSelected
                    ? 'btn-primary text-white shadow-xs scale-102 ring-1 ring-primary/40'
                    : 'btn-ghost bg-base-200/70 hover:bg-base-200 border border-base-300/60 text-base-content/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
                <span>{interest.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            );
          })}
        </div>
        {errors.interests && (
          <p className="text-rose-600 text-xs font-semibold animate-fade-in-up">
            {errors.interests.message}
          </p>
        )}
      </div>

      {/* SECTION 5: ADVANCED PREFERENCES (Collapsible toggle) */}
      <div className="pt-2 border-t border-base-200/70">
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="flex items-center justify-between w-full p-3 rounded-2xl bg-base-200/40 hover:bg-base-200/70 text-xs font-bold text-base-content/80 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <span>More Preferences (Travel Style, Transit Mode, Season)</span>
          </span>
          {showPreferences ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPreferences && (
          <div className="space-y-6 pt-4 animate-fade-in-up">
            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 block">
                Travel Style & Pace
              </label>
              <Controller
                name="travelStyle"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TRAVEL_STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => field.onChange(style.value)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          field.value === style.value
                            ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                            : 'border-base-200 text-base-content/70 hover:border-base-300'
                        }`}
                      >
                        <span className="text-xs font-bold">{style.label}</span>
                        <span className="text-[11px] text-base-content/60">{style.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Preferred Transit Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/75 block">
                Preferred Mode of Transport
              </label>
              <Controller
                name="transportMode"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {TRANSPORT_MODE_OPTIONS.map((mode) => {
                      const ModeIcon = mode.icon;
                      const isSelected = field.value === mode.value;
                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => field.onChange(mode.value)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                              : 'border-base-200 text-base-content/70 hover:border-base-300'
                          }`}
                        >
                          <ModeIcon className="w-4 h-4" />
                          <span className="text-[11px] font-bold">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Travel Month / Timing */}
            <div className="space-y-1.5">
              <label
                htmlFor="startDateOrMonth"
                className="text-xs font-bold uppercase tracking-wider text-base-content/75 block"
              >
                Travel Month or Period (Optional)
              </label>
              <input
                id="startDateOrMonth"
                type="text"
                placeholder="e.g. October, Diwali weekend, or Next month"
                disabled={isLoading}
                {...register('startDateOrMonth')}
                className="input input-bordered w-full h-11 text-xs rounded-xl border-base-300/80"
              />
              <span className="text-[11px] text-base-content/50 font-medium">
                Used to evaluate peak seasonality and weekend rates
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full h-15 rounded-2xl font-black shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 text-base sm:text-lg transition-all duration-200 active:scale-98 gap-2.5 min-h-[56px] text-white cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-md" />
              <span>Building Your Trip...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Generate My Tailored Itinerary</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-base-content/50 font-medium mt-2.5">
          Calculates round-trip transit from {currentOrigin || 'origin'} • Verified day pacing • Realistic ₹ budgeting
        </p>
      </div>
    </form>
  );
};
