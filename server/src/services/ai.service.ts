import { OpenAI } from 'openai';
import { CreateTripInput } from '../schemas/trip.schema.js';
import { aiItinerarySchema, AiItinerary } from '../schemas/ai.schema.js';
import { calculateTripBudget } from './budget.js';
import { ComputedBreakdown } from '../config/constants.js';

export interface GenerationResult {
  itinerary: AiItinerary;
  breakdown: ComputedBreakdown;
  generationSource: 'ai' | 'mock';
}

/**
 * Distributes total costs into day-by-day approximate costs ensuring:
 * sum(day.approximateCost) === breakdown.grandTotal exactly.
 */
function distributeDayCosts(
  daysCount: number,
  breakdown: ComputedBreakdown
): number[] {
  const { grandTotal, stay, intercityTransport } = breakdown;

  if (daysCount === 1) {
    return [grandTotal];
  }

  // Daily running costs (food + local transit + activities + buffer share)
  const nonFixedTotal = grandTotal - stay.total - intercityTransport.roundTripTotal;
  const baseDailyCost = Math.floor(nonFixedTotal / daysCount);
  const stayPerNight = stay.nights > 0 ? Math.floor(stay.total / stay.nights) : 0;
  const oneWayIntercity = Math.floor(intercityTransport.roundTripTotal / 2);

  const dayCosts: number[] = [];

  for (let i = 1; i <= daysCount; i++) {
    let dayCost = baseDailyCost;

    // Day 1 includes outward journey + stay for night 1 (if overnight)
    if (i === 1) {
      dayCost += oneWayIntercity;
      if (stay.nights >= 1) dayCost += stayPerNight;
    }
    // Last day includes return transit journey
    else if (i === daysCount) {
      dayCost += (intercityTransport.roundTripTotal - oneWayIntercity);
    }
    // Intermediate days include daily running + night stay
    else {
      if (i <= stay.nights) {
        dayCost += stayPerNight;
      }
    }

    dayCosts.push(dayCost);
  }

  // Exact penny-reconciliation: ensure sum equals grandTotal down to the last rupee
  const currentSum = dayCosts.reduce((a, b) => a + b, 0);
  const diff = grandTotal - currentSum;
  dayCosts[0] += diff;

  return dayCosts;
}

/**
 * Generates itinerary using OpenAI API or the built-in deterministic engine
 * with strict central budget calculation reconciliation.
 */
export async function generateItinerary(input: CreateTripInput): Promise<GenerationResult> {
  const origin = input.origin || 'Delhi';
  const travelStyle = input.travelStyle || 'Budget';
  const transportMode = input.transportMode || 'Any';
  const accommodation =
    input.accommodation === 'Hostel' || input.accommodation === 'Budget hotel' || input.accommodation === 'Homestay'
      ? input.accommodation
      : 'Budget hotel';

  // 1. Central source of truth for all budget computations
  const breakdown = calculateTripBudget({
    origin,
    destination: input.destination,
    duration: input.duration,
    travellers: input.travellers,
    budget: input.budget,
    travelStyle,
    transportMode,
    accommodation,
    interests: input.interests,
    startDateOrMonth: input.startDateOrMonth,
  });

  const apiKey = process.env.OPENAI_API_KEY;

  // Use fallback if no API key is provided
  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_openai_api_key_here') {
    const mockItinerary = generateDeterministicItinerary(input, breakdown);
    return {
      itinerary: mockItinerary,
      breakdown,
      generationSource: 'mock',
    };
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const OpenAIClient: any = typeof OpenAI === 'function' ? OpenAI : (OpenAI as any).default || OpenAI;
  const openai = new OpenAIClient({
    apiKey: apiKey.trim(),
    timeout: 30_000,
    maxRetries: 2,
    // Use Node.js native fetch instead of OpenAI SDK's bundled undici client.
    // undici causes "Premature close" on Windows/Indian networks for large responses.
    fetch: globalThis.fetch as any,
  });

  const systemPrompt = `You are a hyper-realistic, expert Indian travel planner and budget analyst with up-to-date pricing knowledge (2025-2026 rates).
Generate a precise, realistic, location-specific day-by-day itinerary for Indian domestic travelers based on current, real-world data.

Rules & Directives:
1. Base all recommendations on CURRENT real-world pricing and data for ${input.destination} (entry tickets, local auto/cab fares, famous regional eateries, and authentic local experiences).
2. Cover every day from Day 1 to Day ${input.duration}.
3. Day 1 MUST begin with departure/transit from ${origin} to ${input.destination} via ${breakdown.intercityTransport.suggestedMode} (approx ${breakdown.intercityTransport.approxDurationHours} hrs), check-in at lodging, and light evening exploration.
4. The final day (Day ${input.duration}) MUST include check-out, souvenir/local market shopping, and return transit back to ${origin}.
5. Intermediary days must group nearby sights logically to minimize intra-city travel.
6. Activities must strictly align with selected interests: ${input.interests.join(', ')}.
7. Recommend authentic, top-rated regional eateries, famous dhabas, or street food joints known specifically in ${input.destination}.
8. Return strictly valid JSON with no markdown wrapping.

Format JSON strictly as:
{
  "tripSummary": "A concise overview highlighting the route, lodging vibe, and key sights with current travel context.",
  "days": [
    {
      "day": 1,
      "title": "Title for the day",
      "places": ["Specific Place 1", "Specific Place 2"],
      "activities": ["Morning/Afternoon activity with timing & entry ticket details", "Evening activity"],
      "foodExperiences": ["Famous local breakfast/lunch spot with price vibe", "Dinner place recommendation"],
      "approximateCost": 5000
    }
  ]
}`;

  const userPrompt = `Plan trip using current 2025-2026 travel data:
- Origin: ${origin}
- Destination: ${input.destination}
- Duration: ${input.duration} days (${breakdown.stay.nights} nights)
- Travellers: ${input.travellers}
- Target Group Budget: ₹${input.budget.toLocaleString('en-IN')}
- Travel Style: ${travelStyle}
- Preferred Transit: ${transportMode} (Suggested: ${breakdown.intercityTransport.suggestedMode})
- Lodging: ${accommodation} (${breakdown.stay.unitLabel})
- Interests: ${input.interests.join(', ')}
${input.startDateOrMonth ? `- Travel Timing: ${input.startDateOrMonth}` : ''}

Provide up-to-date, realistic place recommendations, authentic food joints, entry fee estimates, and location-accurate details based on present-day Indian travel conditions.`;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI returned an empty response.');
    }

    const parsedJson = JSON.parse(content);

    // Reconcile day costs with our central budget module
    const dayCosts = distributeDayCosts(input.duration, breakdown);

    const validatedDays = (parsedJson.days || []).slice(0, input.duration).map((day: any, idx: number) => ({
      day: idx + 1,
      title: day.title || `Day ${idx + 1}: Exploring ${input.destination}`,
      places: Array.isArray(day.places) && day.places.length > 0 ? day.places : [`Key landmarks in ${input.destination}`],
      activities: Array.isArray(day.activities) && day.activities.length > 0 ? day.activities : [`Sightseeing in ${input.destination}`],
      foodExperiences: Array.isArray(day.foodExperiences) && day.foodExperiences.length > 0 ? day.foodExperiences : [`Local delicacies in ${input.destination}`],
      approximateCost: dayCosts[idx],
    }));

    // Pad if model returned fewer days than requested
    while (validatedDays.length < input.duration) {
      const idx = validatedDays.length;
      validatedDays.push({
        day: idx + 1,
        title: `Day ${idx + 1}: Exploring ${input.destination}`,
        places: [`${input.destination} local markets and scenic areas`],
        activities: ['Leisure walk, photography, and shopping'],
        foodExperiences: ['Authentic thali / regional food tasting'],
        approximateCost: dayCosts[idx],
      });
    }

    const finalItinerary: AiItinerary = {
      tripSummary:
        parsedJson.tripSummary ||
        `${input.duration}-day ${travelStyle.toLowerCase()} journey from ${origin} to ${input.destination} for ${input.travellers} traveller(s).`,
      days: validatedDays,
      estimatedExpenses: {
        stay: breakdown.stay.total,
        food: breakdown.food.total,
        transport: breakdown.intercityTransport.roundTripTotal + breakdown.localTransport.total,
        activities: breakdown.activities.total,
        miscellaneous: breakdown.buffer.total,
      },
      totalEstimatedCost: breakdown.grandTotal,
    };

    return {
      itinerary: finalItinerary,
      breakdown,
      generationSource: 'ai',
    };
  } catch (error: any) {
    console.warn('AI service failed or timed out. Falling back to deterministic planner:', error?.message);
    const mockItinerary = generateDeterministicItinerary(input, breakdown);
    return {
      itinerary: mockItinerary,
      breakdown,
      generationSource: 'mock',
    };
  }
}

/**
 * Deterministic travel engine tailored to Indian destinations.
 * Always respects origin transit, nights = duration - 1, and mathematical reconciliation.
 */
export function generateDeterministicItinerary(
  input: CreateTripInput,
  breakdown: ComputedBreakdown
): AiItinerary {
  const origin = input.origin || 'Delhi';
  const destination = input.destination;
  const duration = input.duration;
  const travellers = input.travellers;
  const dayCosts = distributeDayCosts(duration, breakdown);

  const days: AiItinerary['days'] = [];

  // Theme progressions
  const themes = [
    {
      title: 'Journey from Origin & Arrival Orientation',
      action: `Depart from ${origin} via ${breakdown.intercityTransport.suggestedMode} (~${breakdown.intercityTransport.approxDurationHours}h). Check into accommodation, unpack, and unwind with an evening stroll.`,
      food: `Enjoy fresh roadside refreshments or a warm regional dinner near the stay.`,
    },
    {
      title: 'Iconic Heritage & Historic Walking Tour',
      action: `Visit the central heritage quarter and primary cultural landmarks. Enjoy scenic photography and architecture.`,
      food: `Authentic regional thali lunch at a renowned heritage eatery.`,
    },
    {
      title: 'Nature Trails & Scenic Viewpoint Discovery',
      action: `Morning hike, lakeside walk, or panoramic viewpoint visit. Experience peaceful natural landscapes.`,
      food: `Local snacks, chai, and regional sweets at a hilltop vantage point.`,
    },
    {
      title: 'Local Bazaars, Crafts & Cultural Immersion',
      action: `Browse traditional bazaars, handloom workshops, and interact with local artisans.`,
      food: `Famous street-food crawl tasting authentic local specialities.`,
    },
    {
      title: 'Outdoor Adventure & Hidden Sights',
      action: `Engage in outdoor activities aligned with your interests (trekking, boating, or cycling).`,
      food: `Casual cafe or farm-to-table lunch sampling fresh regional produce.`,
    },
    {
      title: 'Souvenir Shopping & Farewell Return Journey',
      action: `Final morning shopping for regional spices and souvenirs. Check out and embark on the return trip to ${origin}.`,
      food: `Packaged snacks and farewell meal before boarding transit.`,
    },
  ];

  for (let i = 1; i <= duration; i++) {
    const isFirstDay = i === 1;
    const isLastDay = i === duration;

    let theme = themes[(i - 1) % themes.length];
    if (isFirstDay) {
      theme = themes[0];
    } else if (isLastDay && duration > 1) {
      theme = themes[themes.length - 1];
    }

    const interestTag = input.interests[(i - 1) % input.interests.length] || 'Sightseeing';

    const places = isFirstDay
      ? [`${origin} Transit Terminal`, `${destination} Arrival Center`, `${destination} Local Promenade`]
      : isLastDay
      ? [`${destination} Central Market`, `${destination} Transit Station`, `Return arrival in ${origin}`]
      : [
          `${destination} Historical Monument & Grounds`,
          `${destination} Scenic Nature Viewpoint`,
          `${destination} Old City Bazaars`,
        ];

    const activities = [
      theme.action,
      `Explore highlights with focus on ${interestTag.toLowerCase()}`,
      `Group exploration tailored for ${travellers} person(s)`,
    ];

    const foodExperiences = [
      theme.food,
      `Dinner at a trusted ${destination} dining spot`,
    ];

    days.push({
      day: i,
      title: `Day ${i}: ${theme.title}`,
      places,
      activities,
      foodExperiences,
      approximateCost: dayCosts[i - 1],
    });
  }

  const tripSummary = `A curated ${duration}-day (${breakdown.stay.nights} night) itinerary from ${origin} to ${destination} for ${travellers} traveller(s). Includes round-trip ${breakdown.intercityTransport.suggestedMode} transit, ${breakdown.stay.unitLabel}, and daily food/sightseeing allocations.`;

  return {
    tripSummary,
    days,
    estimatedExpenses: {
      stay: breakdown.stay.total,
      food: breakdown.food.total,
      transport: breakdown.intercityTransport.roundTripTotal + breakdown.localTransport.total,
      activities: breakdown.activities.total,
      miscellaneous: breakdown.buffer.total,
    },
    totalEstimatedCost: breakdown.grandTotal,
  };
}
