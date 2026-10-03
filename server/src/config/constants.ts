/**
 * Shared Indian Travel Constants & City Directory
 */

export const MAJOR_INDIAN_CITIES = [
  'Ahmedabad',
  'Amritsar',
  'Bengaluru',
  'Bhopal',
  'Bhubaneswar',
  'Chandigarh',
  'Chennai',
  'Coimbatore',
  'Dehradun',
  'Delhi NCR',
  'Goa',
  'Guwahati',
  'Hyderabad',
  'Indore',
  'Jaipur',
  'Jammu',
  'Jodhpur',
  'Kochi',
  'Kolkata',
  'Lucknow',
  'Madurai',
  'Mangalore',
  'Mumbai',
  'Nagpur',
  'Patna',
  'Pune',
  'Raipur',
  'Ranchi',
  'Shimla',
  'Srinagar',
  'Surat',
  'Udaipur',
  'Varanasi',
  'Visakhapatnam',
] as const;

export type TravelStyle = 'Budget' | 'Comfortable';
export type TransportMode = 'Any' | 'Train' | 'Bus' | 'Flight' | 'Own vehicle';
export type AccommodationPreference = 'Hostel' | 'Budget hotel' | 'Homestay';

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
