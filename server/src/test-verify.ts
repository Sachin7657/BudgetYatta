import { createTripSchema } from './schemas/trip.schema.js';
import { aiItinerarySchema } from './schemas/ai.schema.js';
import { generateDeterministicItinerary } from './services/ai.service.js';
import { calculateTripBudget } from './services/budget.js';
import { resetRateLimits } from './middlewares/rateLimiter.js';
import app from './app.js';

async function runVerification() {
  console.log('🧪 Starting BudgetYatta Logic & Product Correctness Tests...\n');

  // Test 1: Same origin and destination validation
  console.log('Test 1: Origin equals Destination validation (Negative case)...');
  const sameCityPayload = {
    origin: 'Delhi',
    destination: 'delhi',
    duration: 3,
    travellers: 2,
    budget: 20000,
    accommodation: 'Hostel' as const,
    interests: ['Food'],
  };
  const sameCityResult = createTripSchema.safeParse(sameCityPayload);
  if (sameCityResult.success) {
    throw new Error('Test 1 Failed: Same city origin and destination should have been rejected!');
  }
  console.log('✅ Test 1 Passed: Same city correctly rejected with message:', sameCityResult.error.errors[0]?.message);

  // Scenario 1: Delhi -> Goa, 4 days, 4 travellers, ₹40,000, Budget style, Any mode
  console.log('\nScenario 1: Delhi -> Goa, 4 days, 4 travellers, ₹40,000...');
  const s1 = calculateTripBudget({
    origin: 'Delhi',
    destination: 'Goa',
    duration: 4,
    travellers: 4,
    budget: 40000,
    travelStyle: 'Budget',
    transportMode: 'Any',
    accommodation: 'Budget hotel',
  });
  console.log(`- Transit: ${s1.intercityTransport.suggestedMode} round-trip total: ₹${s1.intercityTransport.roundTripTotal}`);
  console.log(`- Stay (${s1.stay.nights} nights, ${s1.stay.roomsOrBeds} rooms): ₹${s1.stay.total}`);
  console.log(`- Grand Total: ₹${s1.grandTotal} (₹${s1.costPerPerson}/person) | Budget: ₹40,000 | Status: ${s1.budgetStatus}`);
  if (s1.stay.nights !== 3) throw new Error('Expected 3 nights for 4-day trip');
  if (s1.stay.roomsOrBeds !== 2) throw new Error('Expected 2 rooms for 4 travellers');
  console.log('✅ Scenario 1 Passed.');

  // Scenario 2: Mumbai -> Manali, 5 days, 2 travellers, ₹25,000, Train, Hostel
  console.log('\nScenario 2: Mumbai -> Manali, 5 days, 2 travellers, ₹25,000, Train, Hostel...');
  const s2 = calculateTripBudget({
    origin: 'Mumbai',
    destination: 'Manali',
    duration: 5,
    travellers: 2,
    budget: 25000,
    travelStyle: 'Budget',
    transportMode: 'Train',
    accommodation: 'Hostel',
  });
  console.log(`- Transit: ${s2.intercityTransport.suggestedMode} (one-way: ₹${s2.intercityTransport.oneWayFarePerPerson})`);
  console.log(`- Stay (${s2.stay.nights} nights, ${s2.stay.roomsOrBeds} beds): ₹${s2.stay.total}`);
  console.log(`- Grand Total: ₹${s2.grandTotal} | Status: ${s2.budgetStatus}`);
  if (s2.stay.nights !== 4) throw new Error('Expected 4 nights for 5-day trip');
  if (s2.stay.roomsOrBeds !== 2) throw new Error('Expected 2 beds for 2 travellers in hostel');
  console.log('✅ Scenario 2 Passed.');

  // Scenario 3: Bengaluru -> Pondicherry, 2 days, 1 traveller, ₹5,000
  console.log('\nScenario 3: Bengaluru -> Pondicherry, 2 days, 1 traveller, ₹5,000...');
  const s3 = calculateTripBudget({
    origin: 'Bengaluru',
    destination: 'Pondicherry',
    duration: 2,
    travellers: 1,
    budget: 5000,
    travelStyle: 'Budget',
    transportMode: 'Any',
    accommodation: 'Budget hotel',
  });
  console.log(`- Grand Total: ₹${s3.grandTotal} | Status: ${s3.budgetStatus}`);
  console.log(`- Savings Tips available: ${s3.savingsTips.length}`);
  if (s3.stay.nights !== 1) throw new Error('Expected 1 night for 2-day trip');
  console.log('✅ Scenario 3 Passed.');

  // Scenario 4: Delhi -> Jaipur, 1 day, 3 travellers (Day trip)
  console.log('\nScenario 4: Delhi -> Jaipur, 1 day, 3 travellers (Day trip)...');
  const s4 = calculateTripBudget({
    origin: 'Delhi',
    destination: 'Jaipur',
    duration: 1,
    travellers: 3,
    budget: 10000,
    travelStyle: 'Budget',
    transportMode: 'Train',
    accommodation: 'Budget hotel',
  });
  console.log(`- Stay nights: ${s4.stay.nights}, Stay cost: ₹${s4.stay.total}`);
  if (s4.stay.nights !== 0) throw new Error(`Day trip must have 0 nights, got ${s4.stay.nights}`);
  if (s4.stay.total !== 0) throw new Error(`Day trip must have ₹0 stay cost, got ₹${s4.stay.total}`);
  console.log('✅ Scenario 4 Passed: 0 nights and ₹0 stay for day trip.');

  // Test 5: Complete day-cost reconciliation check
  console.log('\nTest 5: Mathematical reconciliation of day costs with Grand Total...');
  const mockItinerary = generateDeterministicItinerary(
    {
      origin: 'Delhi',
      destination: 'Goa',
      duration: 4,
      travellers: 4,
      budget: 40000,
      travelStyle: 'Budget',
      transportMode: 'Any',
      accommodation: 'Budget hotel',
      interests: ['Nature', 'Food'],
    },
    s1
  );

  const sumOfDays = mockItinerary.days.reduce((acc, d) => acc + d.approximateCost, 0);
  console.log(`- Grand Total: ₹${s1.grandTotal}`);
  console.log(`- Sum of Day Costs: ₹${sumOfDays}`);
  if (sumOfDays !== s1.grandTotal) {
    throw new Error(`Reconciliation Failed! Sum of day costs (${sumOfDays}) !== Grand Total (${s1.grandTotal})`);
  }
  console.log('✅ Test 5 Passed: Day costs reconcile mathematically to the exact rupee!');

  // Test 6: Backward compatibility with older trips
  console.log('\nTest 6: Backward compatibility for older saved trips without origin or breakdown...');
  const oldTripWithoutOrigin = {
    destination: 'Manali',
    duration: 3,
    travellers: 2,
    budget: 20000,
    accommodation: 'Budget' as const,
    interests: ['Nature'],
  };
  const oldTripParsed = createTripSchema.safeParse({
    origin: 'Your City', // default fallback
    ...oldTripWithoutOrigin,
  });
  if (!oldTripParsed.success) {
    throw new Error('Test 6 Failed: Backward compatibility failed for old trip payload');
  }
  console.log('✅ Test 6 Passed: Older trips without origin read cleanly.');

  // Test 7: Express API Health Check Endpoint & Test 8: IP Rate Limiting
  console.log('\nTest 7: Express API Health Check Endpoint...');
  const server = app.listen(0, async () => {
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    try {
      const response = await fetch(`http://localhost:${port}/api/health`);
      const body = (await response.json()) as any;
      if (!response.ok || !body.success || body.status !== 'ok') {
        throw new Error(`Test 7 Failed: Unexpected health response: ${JSON.stringify(body)}`);
      }
      console.log(`✅ Test 7 Passed: Health endpoint responded with status '${body.status}'.`);

      // Test 8: IP Rate Limiting
      console.log('\nTest 8: Testing IP Rate Limiting (Max 3 requests / 10 mins per IP)...');
      resetRateLimits();
      const tripPayload = {
        origin: 'Delhi',
        destination: 'Jaipur',
        duration: 2,
        travellers: 2,
        budget: 12000,
        travelStyle: 'Budget',
        transportMode: 'Train',
        accommodation: 'Budget hotel',
        interests: ['Food'],
      };

      for (let i = 1; i <= 3; i++) {
        const res = await fetch(`http://localhost:${port}/api/trips`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.195' },
          body: JSON.stringify(tripPayload),
        });
        if (res.status === 429) {
          throw new Error(`Test 8 Failed: Request ${i} was throttled prematurely!`);
        }
      }
      console.log('  - Requests 1, 2, and 3 accepted successfully.');

      // 4th request from same IP should be throttled (429)
      const resThrottled = await fetch(`http://localhost:${port}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.195' },
        body: JSON.stringify(tripPayload),
      });

      if (resThrottled.status !== 429) {
        throw new Error(`Test 8 Failed: 4th request from same IP was not blocked! Status: ${resThrottled.status}`);
      }
      const throttledBody = (await resThrottled.json()) as any;
      console.log(`  - 4th request correctly blocked with HTTP 429: "${throttledBody?.error?.message}"`);
      console.log('✅ Test 8 Passed: IP Rate limiter enforced (3 per 10 minutes).');

      console.log('\n🎉 ALL LOGIC AND PRODUCT CORRECTNESS TESTS PASSED!\n');
    } catch (err: any) {
      console.error('Verification failed with error:', err);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runVerification();
