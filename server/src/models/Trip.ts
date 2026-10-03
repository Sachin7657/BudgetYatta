import mongoose, { Document, Schema } from 'mongoose';
import { ComputedBreakdown } from '../config/constants.js';

export interface IDayPlan {
  day: number;
  title: string;
  places: string[];
  activities: string[];
  foodExperiences: string[];
  approximateCost: number;
}

export interface IEstimatedExpenses {
  stay: number;
  food: number;
  transport: number;
  activities: number;
  miscellaneous: number;
}

export interface IItinerary {
  tripSummary: string;
  days: IDayPlan[];
}

export interface ITrip extends Document {
  origin: string;
  destination: string;
  duration: number;
  travellers: number;
  budget: number;
  travelStyle: string;
  transportMode: string;
  accommodation: string;
  interests: string[];
  startDateOrMonth?: string;
  itinerary: IItinerary;
  estimatedExpenses: IEstimatedExpenses;
  breakdown?: ComputedBreakdown;
  totalEstimatedCost: number;
  generationSource: 'ai' | 'mock';
  createdAt: Date;
  updatedAt: Date;
}

const DayPlanSchema = new Schema<IDayPlan>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    places: [{ type: String, required: true }],
    activities: [{ type: String, required: true }],
    foodExperiences: [{ type: String, required: true }],
    approximateCost: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const EstimatedExpensesSchema = new Schema<IEstimatedExpenses>(
  {
    stay: { type: Number, required: true, min: 0 },
    food: { type: Number, required: true, min: 0 },
    transport: { type: Number, required: true, min: 0 },
    activities: { type: Number, required: true, min: 0 },
    miscellaneous: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ItinerarySchema = new Schema<IItinerary>(
  {
    tripSummary: { type: String, required: true },
    days: { type: [DayPlanSchema], required: true },
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>(
  {
    origin: { type: String, trim: true, default: 'Your City' },
    destination: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1, max: 30 },
    travellers: { type: Number, required: true, min: 1, max: 20 },
    budget: { type: Number, required: true, min: 0 },
    travelStyle: { type: String, default: 'Budget' },
    transportMode: { type: String, default: 'Any' },
    accommodation: {
      type: String,
      required: true,
    },
    interests: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one interest must be selected',
      },
    },
    startDateOrMonth: { type: String, trim: true },
    itinerary: { type: ItinerarySchema, required: true },
    estimatedExpenses: { type: EstimatedExpensesSchema, required: true },
    breakdown: { type: Schema.Types.Mixed },
    totalEstimatedCost: { type: Number, required: true, min: 0 },
    generationSource: {
      type: String,
      required: true,
      enum: ['ai', 'mock'],
      default: 'ai',
    },
  },
  {
    timestamps: true,
  }
);

// Index to retrieve newest trips quickly
TripSchema.index({ createdAt: -1 });

export const Trip = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);
