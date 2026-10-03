import { Router } from 'express';
import { tripController } from '../controllers/trip.controller.js';
import { aiRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// POST /api/trips - Generate and save a new trip (Rate limited: 3 requests / 10 mins per IP)
router.post('/', aiRateLimiter, (req, res) => tripController.createTrip(req, res));

// GET /api/trips - Retrieve all saved trips
router.get('/', (req, res) => tripController.getAllTrips(req, res));

// GET /api/trips/:id - Retrieve a single trip by ID
router.get('/:id', (req, res) => tripController.getTripById(req, res));

export default router;
