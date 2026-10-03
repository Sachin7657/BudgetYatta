import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createTripSchema } from '../schemas/trip.schema.js';
import { tripService } from '../services/trip.service.js';

export class TripController {
  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      const validatedInput = createTripSchema.parse(req.body);
      const savedTrip = await tripService.createTrip(validatedInput);

      res.status(201).json({
        success: true,
        data: savedTrip,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((e) => e.message).join(', ');
        res.status(400).json({
          success: false,
          error: { message: issues },
        });
        return;
      }

      console.error('Server error in createTrip controller:', error?.message || error);
      res.status(500).json({
        success: false,
        error: {
          message: 'We could not plan this trip right now. Please try again in a moment.',
        },
      });
    }
  }

  async getAllTrips(_req: Request, res: Response): Promise<void> {
    try {
      const trips = await tripService.getAllTrips();
      res.status(200).json({
        success: true,
        data: trips,
      });
    } catch (error: any) {
      console.error('Server error in getAllTrips controller:', error?.message || error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Unable to retrieve saved itineraries right now. Please try again shortly.',
        },
      });
    }
  }

  async getTripById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await tripService.getTripById(id);

      if (!trip) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Trip itinerary not found. It may have been removed.',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: trip,
      });
    } catch (error: any) {
      if (error.message?.includes('Invalid trip ID')) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid trip request.',
          },
        });
        return;
      }

      console.error('Server error in getTripById controller:', error?.message || error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Could not load this itinerary. Please try again.',
        },
      });
    }
  }
}

export const tripController = new TripController();
