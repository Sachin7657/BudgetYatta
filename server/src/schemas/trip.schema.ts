import { z } from 'zod';

export const travelStyleEnum = z.enum(['Budget', 'Comfortable']);
export const transportModeEnum = z.enum(['Any', 'Train', 'Bus', 'Flight', 'Own vehicle']);
export const accommodationEnum = z.enum(['Hostel', 'Budget hotel', 'Homestay', 'Budget', 'Mid-range', 'Luxury']);

export const createTripSchema = z
  .object({
    origin: z
      .string({ required_error: 'Please enter your starting city' })
      .trim()
      .min(2, 'Starting city must be at least 2 characters')
      .max(100, 'Starting city name is too long'),
    destination: z
      .string({ required_error: 'Please enter your destination' })
      .trim()
      .min(2, 'Destination must be at least 2 characters')
      .max(100, 'Destination name is too long'),
    duration: z
      .number({ required_error: 'Duration is required' })
      .int('Duration must be a whole number of days')
      .min(1, 'Trip duration must be at least 1 day')
      .max(15, 'Trip duration cannot exceed 15 days'),
    travellers: z
      .number({ required_error: 'Number of travellers is required' })
      .int('Travellers must be a whole number')
      .min(1, 'At least 1 traveller is required')
      .max(10, 'Maximum 10 travellers allowed per group'),
    budget: z
      .number({ required_error: 'Budget is required' })
      .positive('Please enter a budget greater than ₹0')
      .max(50000000, 'Budget amount is too high'),
    travelStyle: travelStyleEnum.default('Budget'),
    transportMode: transportModeEnum.default('Any'),
    accommodation: accommodationEnum,
    interests: z
      .array(z.string().trim())
      .min(1, 'Please choose at least one travel interest')
      .max(10, 'You can choose up to 10 interests'),
    startDateOrMonth: z.string().trim().optional(),
  })
  .refine(
    (data) => data.origin.toLowerCase().trim() !== data.destination.toLowerCase().trim(),
    {
      message: 'Starting city and destination cannot be the same city.',
      path: ['destination'],
    }
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;
