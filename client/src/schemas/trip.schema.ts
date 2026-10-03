import { z } from 'zod';

export const travelStyleEnum = z.enum(['Budget', 'Comfortable']);
export const transportModeEnum = z.enum(['Any', 'Train', 'Bus', 'Flight', 'Own vehicle']);
export const accommodationEnum = z.enum(['Hostel', 'Budget hotel', 'Homestay']);

export const plannerFormSchema = z
  .object({
    origin: z
      .string()
      .trim()
      .min(2, 'Please enter your starting city (e.g. Delhi, Mumbai, Bengaluru)')
      .max(80, 'City name is too long'),
    destination: z
      .string()
      .trim()
      .min(2, 'Please enter where you want to travel (e.g. Manali, Goa, Jaipur)')
      .max(80, 'Destination name is too long'),
    duration: z.coerce
      .number({ invalid_type_error: 'Please enter number of days' })
      .int('Duration must be whole number of days')
      .min(1, 'Trip duration must be at least 1 day')
      .max(15, 'Trip duration can be up to 15 days'),
    travellers: z.coerce
      .number({ invalid_type_error: 'Please enter number of travellers' })
      .int('Travellers must be a whole number')
      .min(1, 'At least 1 traveller is required')
      .max(10, 'Maximum 10 travellers per plan'),
    budget: z.coerce
      .number({ invalid_type_error: 'Please enter total budget in INR (₹)' })
      .positive('Please enter a total budget greater than ₹0')
      .max(50000000, 'Budget is too high'),
    travelStyle: travelStyleEnum,
    transportMode: transportModeEnum,
    accommodation: accommodationEnum,
    interests: z
      .array(z.string())
      .min(1, 'Please select at least one travel interest')
      .max(10, 'You can select up to 10 interests'),
    startDateOrMonth: z.string().trim().optional(),
  })
  .refine(
    (data) => data.origin.toLowerCase().trim() !== data.destination.toLowerCase().trim(),
    {
      message: 'Starting city and destination cannot be the same city.',
      path: ['destination'],
    }
  );

export type PlannerFormData = z.infer<typeof plannerFormSchema>;
