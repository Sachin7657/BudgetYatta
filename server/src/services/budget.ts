import {
  TravelStyle,
  TransportMode,
  AccommodationPreference,
  ComputedBreakdown,
  IntercityLeg,
} from '../config/constants.js';

export interface BudgetInputParams {
  origin: string;
  destination: string;
  duration: number; // 1 to 15
  travellers: number; // 1 to 10
  budget: number; // in INR
  travelStyle: TravelStyle;
  transportMode: TransportMode;
  accommodation: AccommodationPreference;
  interests?: string[];
  startDateOrMonth?: string;
}

/**
 * Heuristic distance tier between Indian cities
 */
type DistanceTier = 'short' | 'medium' | 'long' | 'very_long';

function getDistanceTier(origin: string, destination: string): DistanceTier {
  const o = origin.toLowerCase().trim();
  const d = destination.toLowerCase().trim();

  // Known short pairs (under ~450 km)
  const shortPairs = [
    ['delhi', 'jaipur'],
    ['delhi', 'agra'],
    ['delhi', 'chandigarh'],
    ['delhi', 'dehradun'],
    ['delhi', 'haridwar'],
    ['delhi', 'rishikesh'],
    ['mumbai', 'pune'],
    ['mumbai', 'lonavala'],
    ['mumbai', 'alibaug'],
    ['mumbai', 'nashik'],
    ['bengaluru', 'mysore'],
    ['bengaluru', 'coorg'],
    ['bengaluru', 'pondicherry'],
    ['bengaluru', 'chennai'],
    ['bengaluru', 'ooty'],
    ['chennai', 'pondicherry'],
    ['kolkata', 'digha'],
    ['kolkata', 'mandarmani'],
    ['hyderabad', 'warangal'],
    ['ahmedabad', 'udaipur'],
  ];

  for (const [c1, c2] of shortPairs) {
    if ((o.includes(c1) && d.includes(c2)) || (o.includes(c2) && d.includes(c1))) {
      return 'short';
    }
  }

  // Cross-country long pairs (North to South, East to West)
  const isNorth = (s: string) => /delhi|punjab|himachal|kashmir|chandigarh|uttarakhand|shimla|manali|jammu/i.test(s);
  const isSouth = (s: string) => /bengaluru|bangalore|chennai|kochi|kerala|hyderabad|pondicherry|madurai|coimbatore/i.test(s);
  const isEast = (s: string) => /kolkata|guwahati|assam|sikkim|odisha|bhubaneswar/i.test(s);
  const isWest = (s: string) => /mumbai|goa|pune|ahmedabad|gujarat/i.test(s);

  if ((isNorth(o) && isSouth(d)) || (isSouth(o) && isNorth(d)) || (isEast(o) && isWest(d)) || (isWest(o) && isEast(d))) {
    return 'very_long';
  }

  if ((isNorth(o) && isWest(d)) || (isWest(o) && isNorth(d)) || (isSouth(o) && isEast(d)) || (isEast(o) && isSouth(d))) {
    return 'long';
  }

  return 'medium';
}

/**
 * Calculates intercity transit leg realistically for Indian routes
 */
export function calculateIntercityTransport(
  origin: string,
  destination: string,
  travellers: number,
  preferredMode: TransportMode,
  travelStyle: TravelStyle
): IntercityLeg {
  const tier = getDistanceTier(origin, destination);

  let mode: 'Train' | 'Bus' | 'Flight' | 'Road / Self-drive' = 'Train';

  if (preferredMode === 'Flight') {
    mode = 'Flight';
  } else if (preferredMode === 'Bus') {
    mode = 'Bus';
  } else if (preferredMode === 'Train') {
    mode = 'Train';
  } else if (preferredMode === 'Own vehicle') {
    mode = 'Road / Self-drive';
  } else {
    // 'Any' - select best value
    if (tier === 'short') {
      mode = travelStyle === 'Comfortable' ? 'Train' : 'Bus';
    } else if (tier === 'very_long') {
      mode = travelStyle === 'Comfortable' ? 'Flight' : 'Train';
    } else {
      mode = 'Train';
    }
  }

  let oneWayFare = 600;
  let durationHours = 8;
  let note = '';

  switch (mode) {
    case 'Flight': {
      if (tier === 'short') {
        oneWayFare = 3800;
        durationHours = 1.5;
        note = 'Direct regional flight or fast hopping route';
      } else if (tier === 'medium') {
        oneWayFare = 4600;
        durationHours = 2.5;
        note = 'Domestic economy flight (advance saver fare)';
      } else if (tier === 'long') {
        oneWayFare = 5800;
        durationHours = 3;
        note = 'Regular domestic economy fare with standard baggage';
      } else {
        oneWayFare = 7200;
        durationHours = 3.5;
        note = 'Long-haul cross-country economy flight';
      }
      break;
    }
    case 'Bus': {
      if (tier === 'short') {
        oneWayFare = travelStyle === 'Comfortable' ? 750 : 450;
        durationHours = 5;
        note = travelStyle === 'Comfortable' ? 'AC Volvo / BharatBenz semi-sleeper' : 'State RTC express bus';
      } else if (tier === 'medium') {
        oneWayFare = travelStyle === 'Comfortable' ? 1400 : 850;
        durationHours = 12;
        note = 'Overnight AC Multi-axle sleeper bus';
      } else {
        oneWayFare = travelStyle === 'Comfortable' ? 2200 : 1400;
        durationHours = 18;
        note = 'Long-distance inter-state sleeper bus';
      }
      break;
    }
    case 'Road / Self-drive': {
      // Estimate toll + fuel per group
      const baseFuelAndToll =
        tier === 'short' ? 3200 : tier === 'medium' ? 6500 : tier === 'long' ? 11000 : 16000;
      oneWayFare = Math.round(baseFuelAndToll / Math.max(1, travellers));
      durationHours = tier === 'short' ? 5 : tier === 'medium' ? 11 : 20;
      note = 'Estimated fuel and highway FASTag toll shared across group';
      break;
    }
    case 'Train':
    default: {
      if (tier === 'short') {
        oneWayFare = travelStyle === 'Comfortable' ? 650 : 280;
        durationHours = 5;
        note = travelStyle === 'Comfortable' ? 'Shatabdi/Vande Bharat Chair Car' : 'Superfast Sleeper (SL)';
      } else if (tier === 'medium') {
        oneWayFare = travelStyle === 'Comfortable' ? 1350 : 520;
        durationHours = 12;
        note = travelStyle === 'Comfortable' ? 'AC 3-Tier (3A) reservation' : 'Sleeper Class (SL)';
      } else if (tier === 'long') {
        oneWayFare = travelStyle === 'Comfortable' ? 1950 : 750;
        durationHours = 20;
        note = travelStyle === 'Comfortable' ? 'AC 3-Tier / 2-Tier on Express' : 'Standard Sleeper reservation';
      } else {
        oneWayFare = travelStyle === 'Comfortable' ? 2500 : 980;
        durationHours = 30;
        note = travelStyle === 'Comfortable' ? 'AC 3-Tier Rajdhani/Superfast' : 'Long-haul Sleeper ticket';
      }
      break;
    }
  }

  const roundTripTotal = oneWayFare * 2 * travellers;

  return {
    suggestedMode: mode,
    oneWayFarePerPerson: oneWayFare,
    roundTripTotal,
    approxDurationHours: durationHours,
    travelNote: note,
  };
}

/**
 * Central budget calculation engine.
 * Computes all line items, room count, nights, buffer, savings tips, and ensures total reconciliation.
 */
export function calculateTripBudget(params: BudgetInputParams): ComputedBreakdown {
  const {
    origin,
    destination,
    duration,
    travellers,
    budget,
    travelStyle,
    transportMode,
    accommodation,
  } = params;

  const intercity = calculateIntercityTransport(
    origin,
    destination,
    travellers,
    transportMode,
    travelStyle
  );

  const nights = Math.max(0, duration - 1);
  let roomsOrBeds = 1;
  let ratePerUnitPerNight = 1000;
  let unitLabel = 'room(s)';

  if (nights === 0) {
    roomsOrBeds = 0;
    ratePerUnitPerNight = 0;
    unitLabel = 'Day trip (no overnight stay)';
  } else if (accommodation === 'Hostel') {
    roomsOrBeds = travellers;
    ratePerUnitPerNight = travelStyle === 'Comfortable' ? 900 : 550;
    unitLabel = `${roomsOrBeds} dorm bed(s)`;
  } else if (accommodation === 'Budget hotel') {
    roomsOrBeds = Math.ceil(travellers / 2);
    ratePerUnitPerNight = travelStyle === 'Comfortable' ? 2200 : 1300;
    unitLabel = `${roomsOrBeds} hotel room(s) (2/room)`;
  } else {
    roomsOrBeds = Math.ceil(travellers / 2);
    ratePerUnitPerNight = travelStyle === 'Comfortable' ? 2600 : 1500;
    unitLabel = `${roomsOrBeds} homestay room(s)`;
  }

  const stayTotal = nights > 0 ? roomsOrBeds * ratePerUnitPerNight * nights : 0;

  const foodPerPersonPerDay = travelStyle === 'Comfortable' ? 850 : 450;
  const foodTotal = foodPerPersonPerDay * travellers * duration;

  const localTransportPerDay =
    travelStyle === 'Comfortable'
      ? Math.max(1000, 350 * travellers)
      : Math.max(450, 180 * travellers);
  const localTransportTotal = localTransportPerDay * duration;

  const activityPerPersonTotal = Math.round(
    duration * (travelStyle === 'Comfortable' ? 450 : 250)
  );
  const activitiesTotal = activityPerPersonTotal * travellers;

  const subtotal =
    intercity.roundTripTotal +
    stayTotal +
    foodTotal +
    localTransportTotal +
    activitiesTotal;

  // 8% contingency reserve
  const bufferTotal = Math.round(subtotal * 0.08);

  const grandTotal = subtotal + bufferTotal;
  const costPerPerson = Math.round(grandTotal / travellers);

  const diff = Math.abs(budget - grandTotal);
  let status: 'under' | 'near' | 'over' = 'under';

  if (grandTotal > budget) {
    status = 'over';
  } else if (grandTotal >= budget * 0.9) {
    status = 'near';
  } else {
    status = 'under';
  }

  const savingsTips: string[] = [];

  if (status === 'over') {
    if (intercity.suggestedMode === 'Flight') {
      const trainCost = calculateIntercityTransport(
        origin,
        destination,
        travellers,
        'Train',
        'Budget'
      ).roundTripTotal;
      const trainSavings = intercity.roundTripTotal - trainCost;
      if (trainSavings > 0) {
        savingsTips.push(
          `Switch from flights to Train (Sleeper/3AC) to save approx ₹${trainSavings.toLocaleString('en-IN')} for your group.`
        );
      }
    }

    if (accommodation !== 'Hostel' && nights > 0) {
      const hostelStayTotal = travellers * 600 * nights;
      const staySavings = stayTotal - hostelStayTotal;
      if (staySavings > 800) {
        savingsTips.push(
          `Opt for certified backpacker hostel dorms to save around ₹${staySavings.toLocaleString('en-IN')} on lodging.`
        );
      }
    }

    if (travelStyle === 'Comfortable') {
      const budgetFoodTotal = 450 * travellers * duration;
      const foodSavings = foodTotal - budgetFoodTotal;
      if (foodSavings > 1000) {
        savingsTips.push(
          `Favor celebrated regional dhabas & thali joints over formal cafes to save approx ₹${foodSavings.toLocaleString('en-IN')}.`
        );
      }
    }

    if (duration > 2 && savingsTips.length < 2) {
      const perDayCost = Math.round(
        (stayTotal / Math.max(1, nights)) + (foodTotal / duration) + localTransportPerDay
      );
      savingsTips.push(
        `Trimming trip duration by 1 day would reduce your overall cost by roughly ₹${perDayCost.toLocaleString('en-IN')}.`
      );
    }
  }

  const surplusSuggestions: string[] = [];
  if (status === 'under' && diff >= 3000) {
    surplusSuggestions.push(
      `You have ~₹${diff.toLocaleString('en-IN')} remaining headroom! Consider upgrading to AC 3-Tier/Vande Bharat or adding a premium sunset boat/safari experience.`
    );
  }

  const assumptions = [
    nights > 0
      ? `Stay based on ${roomsOrBeds} ${unitLabel} for ${nights} night(s)`
      : 'Day trip (no overnight lodging required)',
    `Round-trip transit via ${intercity.suggestedMode} from ${origin} to ${destination} (~₹${intercity.oneWayFarePerPerson.toLocaleString('en-IN')}/person one way)`,
    `Food budgeted at ₹${foodPerPersonPerDay}/person/day covering breakfast, lunch, tea, and dinner`,
    `Local city transit calculated for ${travellers} person(s) via auto/metro/local cab`,
    'Includes an 8% emergency contingency buffer for unforeseen expenses or ticket price changes',
  ];

  return {
    intercityTransport: intercity,
    stay: {
      nights,
      roomsOrBeds,
      ratePerUnitPerNight,
      total: stayTotal,
      unitLabel,
    },
    food: {
      perPersonPerDay: foodPerPersonPerDay,
      total: foodTotal,
    },
    localTransport: {
      perDay: localTransportPerDay,
      total: localTransportTotal,
    },
    activities: {
      perPersonTotal: activityPerPersonTotal,
      total: activitiesTotal,
    },
    buffer: {
      ratePercent: 8,
      total: bufferTotal,
    },
    grandTotal,
    costPerPerson,
    budgetStatus: status,
    differenceAmount: diff,
    savingsTips,
    surplusSuggestions,
    assumptions,
  };
}
