import type { ApiResponse, CreateTripInput, Trip } from '../types/trip';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Generic fetch wrapper with standard error handling
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data: ApiResponse<T> = await res.json().catch(() => ({
      success: false,
      error: { message: `Server returned ${res.status} status without JSON body` },
    }));

    if (!res.ok || !data.success) {
      const errorMessage = data.error?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    if (data.data === undefined) {
      throw new Error('API returned successful status but missing data payload.');
    }

    return data.data;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Could not connect to the backend server. Please verify the backend is running.');
    }
    throw error;
  }
}

export const api = {
  /**
   * Health check endpoint
   */
  async checkHealth(): Promise<{ status: string; database: string }> {
    return request<{ status: string; database: string }>('/api/health');
  },

  /**
   * Generate and persist a new trip
   */
  async createTrip(input: CreateTripInput): Promise<Trip> {
    return request<Trip>('/api/trips', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Retrieve all previously generated trips
   */
  async getTrips(): Promise<Trip[]> {
    return request<Trip[]>('/api/trips');
  },

  /**
   * Retrieve single trip by MongoDB ID
   */
  async getTripById(id: string): Promise<Trip> {
    return request<Trip>(`/api/trips/${id}`);
  },
};
