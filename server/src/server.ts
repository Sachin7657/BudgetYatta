import app from './app.js';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startLocalServer() {
  try {
    if (process.env.MONGODB_URI) {
      console.log('Connecting to MongoDB Atlas...');
      await connectToDatabase();
      console.log('Connected to MongoDB Atlas successfully.');
    } else {
      console.warn('⚠️ MONGODB_URI is not set. Ensure it is defined in .env for database operations.');
    }
  } catch (err: any) {
    console.error('Failed to connect to MongoDB at startup:', err?.message || err);
  }

  app.listen(PORT, () => {
    console.log(`Server is running locally at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Trips API: http://localhost:${PORT}/api/trips`);
  });
}

startLocalServer();
