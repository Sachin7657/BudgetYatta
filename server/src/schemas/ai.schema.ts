import { z } from 'zod';

export const dayPlanSchema = z.object({
  day: z.number().int().min(1),
  title: z.string().trim().min(2, 'Day title is required'),
  places: z.array(z.string().trim()).min(1, 'At least one place is required'),
  activities: z.array(z.string().trim()).min(1, 'At least one activity is required'),
  foodExperiences: z.array(z.string().trim()).min(1, 'At least one food experience is required'),
  approximateCost: z.number().nonnegative('Day approximate cost must be 0 or more'),
});

export const estimatedExpensesSchema = z.object({
  stay: z.number().nonnegative('Stay cost must be non-negative'),
  food: z.number().nonnegative('Food cost must be non-negative'),
  transport: z.number().nonnegative('Transport cost must be non-negative'),
  activities: z.number().nonnegative('Activities cost must be non-negative'),
  miscellaneous: z.number().nonnegative('Miscellaneous cost must be non-negative'),
});

export const aiItinerarySchema = z.object({
  tripSummary: z.string().trim().min(10, 'Trip summary must be at least 10 characters'),
  days: z.array(dayPlanSchema).min(1, 'Itinerary must include at least 1 day'),
  estimatedExpenses: estimatedExpensesSchema,
  totalEstimatedCost: z.number().nonnegative('Total estimated cost must be non-negative'),
});

export type DayPlan = z.infer<typeof dayPlanSchema>;
export type EstimatedExpenses = z.infer<typeof estimatedExpensesSchema>;
export type AiItinerary = z.infer<typeof aiItinerarySchema>;
