export type TravelStyle = 'Budget' | 'Comfortable';
export type TransportMode = 'Any' | 'Train' | 'Bus' | 'Flight' | 'Own vehicle';
export type AccommodationType = 'Hostel' | 'Budget hotel' | 'Homestay' | 'Budget' | 'Mid-range' | 'Luxury';

export interface IntercityLeg {
  suggestedMode: 'Train' | 'Bus' | 'Flight' | 'Road / Self-drive';
  oneWayFarePerPerson: number;
  roundTripTotal: number;
  approxDurationHours: number;
  travelNote: string;
}

export interface ComputedBreakdown {
  intercityTransport: IntercityLeg;
  stay: {
    nights: number;
    roomsOrBeds: number;
    ratePerUnitPerNight: number;
    total: number;
    unitLabel: string;
  };
  food: {
    perPersonPerDay: number;
    total: number;
  };
  localTransport: {
    perDay: number;
    total: number;
  };
  activities: {
    perPersonTotal: number;
    total: number;
  };
  buffer: {
    ratePercent: number;
    total: number;
  };
  grandTotal: number;
  costPerPerson: number;
  budgetStatus: 'under' | 'near' | 'over';
  differenceAmount: number;
  savingsTips: string[];
  surplusSuggestions?: string[];
  assumptions: string[];
}

export interface DayPlan {
  day: number;
  title: string;
  places: string[];
  activities: string[];
  foodExperiences: string[];
  approximateCost: number;
}

export interface EstimatedExpenses {
  stay: number;
  food: number;
  transport: number;
  activities: number;
  miscellaneous: number;
}

export interface Itinerary {
  tripSummary: string;
  days: DayPlan[];
}

export interface Trip {
  _id: string;
  origin?: string;
  destination: string;
  duration: number;
  travellers: number;
  budget: number;
  travelStyle?: TravelStyle;
  transportMode?: TransportMode;
  accommodation: AccommodationType;
  interests: string[];
  startDateOrMonth?: string;
  itinerary: Itinerary;
  estimatedExpenses: EstimatedExpenses;
  breakdown?: ComputedBreakdown;
  totalEstimatedCost: number;
  generationSource?: 'ai' | 'mock';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  origin: string;
  destination: string;
  duration: number;
  travellers: number;
  budget: number;
  travelStyle?: TravelStyle;
  transportMode?: TransportMode;
  accommodation: AccommodationType;
  interests: string[];
  startDateOrMonth?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
}
