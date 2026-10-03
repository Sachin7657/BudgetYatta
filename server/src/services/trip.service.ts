import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database.js';
import { Trip, ITrip } from '../models/Trip.js';
import { CreateTripInput } from '../schemas/trip.schema.js';
import { generateItinerary } from './ai.service.js';

export class TripService {
  async createTrip(input: CreateTripInput): Promise<ITrip> {
    const { itinerary, breakdown, generationSource } = await generateItinerary(input);

    const newTrip = new Trip({
      origin: input.origin || 'Delhi',
      destination: input.destination,
      duration: input.duration,
      travellers: input.travellers,
      budget: input.budget,
      travelStyle: input.travelStyle || 'Budget',
      transportMode: input.transportMode || 'Any',
      accommodation: input.accommodation,
      interests: input.interests,
      startDateOrMonth: input.startDateOrMonth,
      itinerary: {
        tripSummary: itinerary.tripSummary,
        days: itinerary.days,
      },
      estimatedExpenses: itinerary.estimatedExpenses,
      breakdown,
      totalEstimatedCost: itinerary.totalEstimatedCost,
      generationSource,
    });

    try {
      await connectToDatabase();
      return await newTrip.save();
    } catch (dbError: any) {
      console.warn('MongoDB unreachable, returning in-memory trip:', dbError?.message || dbError);
      return newTrip;
    }
  }

  async getAllTrips(limit = 50): Promise<ITrip[]> {
    await connectToDatabase();
    return Trip.find().sort({ createdAt: -1 }).limit(limit).exec();
  }

  async getTripById(id: string): Promise<ITrip | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid trip ID format.');
    }

    await connectToDatabase();
    return Trip.findById(id).exec();
  }
}

export const tripService = new TripService();
