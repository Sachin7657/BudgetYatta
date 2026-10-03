import React, { useEffect, useState } from 'react';
import type { Trip } from '../types/trip';
import { api } from '../lib/api';
import { TripCard } from '../components/TripCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorAlert } from '../components/ErrorAlert';
import { History, Search, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PreviousTripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTrips();
      setTrips(data);
    } catch (err: any) {
      console.error('Failed to load trips:', err);
      setError(
        err?.message || 'Could not fetch saved trips right now. Please check your network and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((t) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (t.origin && t.origin.toLowerCase().includes(query)) ||
      t.destination.toLowerCase().includes(query) ||
      t.accommodation.toLowerCase().includes(query) ||
      t.interests.some((i) => i.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-wider mb-1.5">
            <History className="w-4 h-4" />
            <span>Saved Journey History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
            Your Planned Trips
          </h1>
          <p className="text-sm text-base-content/65 mt-1 font-medium">
            Revisit, print, and track all your custom travel itineraries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTrips}
            disabled={isLoading}
            className="btn btn-ghost btn-sm rounded-xl gap-2 font-bold min-h-[44px] border border-base-200"
            title="Refresh trips"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/"
            className="btn btn-primary btn-sm rounded-xl gap-2 font-bold shadow-md shadow-orange-600/20 text-white min-h-[44px] px-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan New Journey</span>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <ErrorAlert
          message={error}
          onRetry={fetchTrips}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Search and filters bar */}
      {!isLoading && trips.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl border border-base-200/90 shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by starting city, destination, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full pl-10 h-11 focus:outline-hidden focus:ring-2 focus:ring-primary/40 rounded-xl text-sm"
            />
          </div>

          <div className="text-xs font-bold text-base-content/60 self-center">
            Showing <span className="text-primary font-black">{filteredTrips.length}</span> of{' '}
            <span className="text-base-content font-black">{trips.length}</span> saved itineraries
          </div>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="card bg-base-100 border border-base-200/80 shadow-xs rounded-3xl overflow-hidden animate-pulse"
            >
              <div className="h-28 bg-base-300" />
              <div className="p-6 space-y-4">
                <div className="h-4 bg-base-300 rounded-md w-3/4" />
                <div className="h-3 bg-base-300 rounded-md w-full" />
                <div className="h-3 bg-base-300 rounded-md w-2/3" />
                <div className="h-10 bg-base-300 rounded-xl w-full pt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="No saved journeys yet"
          description="You haven't generated any travel itineraries yet. Start planning your first budget-smart trip now!"
          buttonText="Plan a Journey"
          buttonLink="/"
        />
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-base-100 rounded-3xl border border-base-200 p-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-base text-base-content/75 font-semibold">
            No saved itineraries matching "<span className="text-primary font-bold">{searchQuery}</span>".
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="btn btn-sm btn-ghost text-primary font-bold"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};
