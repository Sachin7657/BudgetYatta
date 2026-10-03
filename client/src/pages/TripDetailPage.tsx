import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Trip } from '../types/trip';
import { api } from '../lib/api';
import { TripHeader } from '../components/TripHeader';
import { ExpenseBreakdown } from '../components/ExpenseBreakdown';
import { ItineraryDayCard } from '../components/ItineraryDayCard';
import { ErrorAlert } from '../components/ErrorAlert';
import { ArrowLeft, Sparkles, Route } from 'lucide-react';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getTripById(id);
      setTrip(data);
    } catch (err: any) {
      console.error('Failed to fetch trip by ID:', err);
      setError(err?.message || 'Could not find or retrieve this trip itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in-up">
        <div className="h-9 bg-base-300 rounded-xl w-48 animate-pulse" />
        <div className="card bg-base-100 border border-base-200 p-8 sm:p-12 rounded-3xl space-y-4 animate-pulse">
          <div className="h-10 bg-base-300 rounded-xl w-1/3" />
          <div className="h-4 bg-base-300 rounded-md w-3/4" />
          <div className="h-4 bg-base-300 rounded-md w-1/2" />
        </div>
        <div className="h-64 bg-base-100 border border-base-200 rounded-3xl p-8 animate-pulse" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in-up">
        <ErrorAlert message={error || 'Trip not found.'} onRetry={fetchTrip} />
        <div>
          <Link
            to="/trips"
            className="btn btn-outline btn-primary rounded-xl gap-2 font-bold min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Saved Itineraries</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in-up">
      {/* Hero Header with destination banner */}
      <TripHeader trip={trip} />

      {/* Financial Breakdown with animated count-up meter */}
      <ExpenseBreakdown
        expenses={trip.estimatedExpenses}
        totalCost={trip.totalEstimatedCost}
        budget={trip.budget}
        breakdown={trip.breakdown}
        travellers={trip.travellers}
      />

      {/* Day by Day Itinerary Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-base-200/80 pb-5 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md mb-1">
              <Route className="w-3.5 h-3.5" />
              <span>Full Schedule</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              Day-by-Day Journey Itinerary
            </h2>
            <p className="text-xs sm:text-sm text-base-content/65 mt-0.5 font-medium">
              Geographically sequenced highlights, curated activities, and culinary stops.
            </p>
          </div>
          <span className="badge badge-lg bg-base-100 border-2 border-orange-200 text-orange-700 font-black px-4 py-3 text-xs rounded-xl shadow-2xs self-start sm:self-auto">
            {trip.itinerary.days.length} Days Planned
          </span>
        </div>

        {/* Days List Timeline */}
        <div className="pt-2">
          {trip.itinerary.days.map((day, idx) => (
            <ItineraryDayCard
              key={day.day}
              day={day}
              isLast={idx === trip.itinerary.days.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation CTA */}
      <div className="flex flex-wrap items-center justify-between pt-8 border-t border-base-200/80 gap-4 no-print">
        <Link
          to="/trips"
          className="btn btn-ghost btn-sm rounded-xl font-bold gap-2 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Browse All Saved Itineraries</span>
        </Link>
        <Link
          to="/"
          className="btn btn-primary btn-sm rounded-xl font-black gap-2 shadow-md shadow-orange-600/20 text-white min-h-[44px] px-5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan Another Journey</span>
        </Link>
      </div>
    </div>
  );
};
