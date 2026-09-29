import { query, queryOne } from '../config/db.js';
import { config } from '../config/env.js';

export async function generateTravelPlan(input) {
  const {
    destination = 'Manali',
    days = 3,
    travelMonth = 'October',
    budget = 500,
    travelersCount = 2,
    travelType = 'Adventure',
    interests = ['Mountains', 'Trekking', 'Photography'],
    accommodation = 'Standard Hotel',
    transport = 'Private Vehicle'
  } = input;

  const numDays = Math.max(1, Math.min(14, Number(days) || 3));
  const normalizedDest = destination.trim();

  // 1. Check AI Provider if API key is present
  if (config.aiApiKey && config.aiApiKey.length > 10 && config.aiProvider === 'gemini') {
    try {
      const promptText = `Generate a JSON travel itinerary for ${numDays} days in ${normalizedDest}. Travel type: ${travelType}. Budget: $${budget} for ${travelersCount} travelers. Interests: ${interests.join(', ')}. Return strictly JSON format with keys: itinerary (array of days with dayNumber, title, morning, afternoon, evening), estimatedBudgetBreakdown, travelTips, weatherConsiderations, suggestedAttractions.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.aiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          try {
            const cleanJson = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            return { ...cleanJson, source: 'Gemini AI Generator' };
          } catch (e) {
            // fallback if output not strict JSON
          }
        }
      }
    } catch (err) {
      console.warn('[TravelPlannerService] Gemini AI call failed. Using Exploria Intelligent Travel Engine.');
    }
  }

  // 2. Deterministic Local AI Travel Engine
  // Query database for matched destination, packages, and adventures
  const dbDest = await queryOne('SELECT * FROM destinations WHERE name LIKE ?', [`%${normalizedDest}%`]);
  const matchedPackages = await query(
    'SELECT * FROM packages WHERE destination_id = ? OR title LIKE ? LIMIT 2',
    [dbDest ? dbDest.id : 0, `%${normalizedDest}%`]
  );
  const matchedAdventures = await query(
    'SELECT * FROM adventures WHERE destination_id = ? OR name LIKE ? LIMIT 3',
    [dbDest ? dbDest.id : 0, `%${normalizedDest}%`]
  );

  const itineraryDays = [];
  const sampleActivities = [
    { morning: 'Morning scenic panorama walk & local breakfast', afternoon: 'Guided outdoor adventure session & landmark photography', evening: 'Sunset viewpoint walk & local night food tasting' },
    { morning: 'Visit famous heritage monastery/temple & artisan craft market', afternoon: 'Exciting outdoor river/mountain activity with safety gear', evening: 'Cultural folk performance & bonfire dinner' },
    { morning: 'Nature wildlife trail walk & photography excursion', afternoon: 'Explore local cafe district & artisan souvenir shopping', evening: 'Starlit camp dinner & relaxing evening social' },
    { morning: 'High altitude cable car gondola / ridge hike', afternoon: 'Valley stream picnic & photography session', evening: 'Souvenir shopping & farewell dinner' }
  ];

  for (let d = 1; d <= numDays; d++) {
    const act = sampleActivities[(d - 1) % sampleActivities.length];
    itineraryDays.push({
      dayNumber: d,
      title: `Day ${d}: ${normalizedDest} ${travelType} Experience`,
      morning: act.morning,
      afternoon: act.afternoon,
      evening: act.evening
    });
  }

  const calculatedBudgetPerPerson = Math.round((Number(budget) || 400) / Number(travelersCount));

  return {
    destination: dbDest ? dbDest.name : normalizedDest,
    countryState: dbDest ? dbDest.country_state : 'India',
    days: numDays,
    travelType,
    travelersCount,
    source: 'Exploria Intelligent Itinerary Engine',
    itinerary: itineraryDays,
    estimatedBudgetBreakdown: {
      totalBudget: Number(budget),
      perPerson: calculatedBudgetPerPerson,
      accommodation: Math.round(calculatedBudgetPerPerson * 0.4),
      activities: Math.round(calculatedBudgetPerPerson * 0.35),
      foodAndTransport: Math.round(calculatedBudgetPerPerson * 0.25)
    },
    suggestedAttractions: dbDest && dbDest.popular_activities
      ? (typeof dbDest.popular_activities === 'string' ? JSON.parse(dbDest.popular_activities) : dbDest.popular_activities)
      : ['Local Heritage Walk', 'Scenic Viewpoint', 'Adventure Activity Spot'],
    recommendedPackages: matchedPackages.map(p => ({ id: p.id, title: p.title, price: p.price, duration_days: p.duration_days, cover_image: p.cover_image })),
    recommendedAdventures: matchedAdventures.map(a => ({ id: a.id, name: a.name, category: a.category, price: a.price, duration: a.duration })),
    weatherConsiderations: `Recommended season for ${normalizedDest}: ${dbDest ? dbDest.best_time : 'October to May'}. Pack appropriate clothing for outdoor trails.`,
    travelTips: [
      'Carry valid photo ID and permits for restricted alpine or coastal areas.',
      'Always stay hydrated and carry sun lotion + warm thermal layers for evening temperatures.',
      'Connect with a verified Exploria local guide for safety on high-altitude trails.'
    ]
  };
}
