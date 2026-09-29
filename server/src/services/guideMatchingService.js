import { query } from '../config/db.js';

export async function findMatchingGuides({ destination, preferredActivities, budget }) {
  const guides = await query(
    `SELECT g.*, u.name, u.email, u.phone, u.avatar, u.bio FROM guides g
     JOIN users u ON g.user_id = u.id
     WHERE g.is_approved = 1 AND g.availability_status = 'AVAILABLE'`
  );

  const normalizedDest = (destination || '').toLowerCase();
  const activities = Array.isArray(preferredActivities) 
    ? preferredActivities 
    : (preferredActivities || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

  const scoredGuides = guides.map(g => {
    let score = 0;
    const gLocation = (g.location || '').toLowerCase();
    const gSpecs = typeof g.specializations === 'string' ? JSON.parse(g.specializations) : (g.specializations || []);
    const gSpecsLower = gSpecs.map(s => s.toLowerCase());

    // 1. Destination / Area familiarity match (40 points max)
    if (gLocation.includes(normalizedDest) || normalizedDest.includes(gLocation)) {
      score += 40;
    } else {
      // Partial match on state or region words
      const destTokens = normalizedDest.split(/[\s,]+/);
      for (const token of destTokens) {
        if (token.length > 3 && gLocation.includes(token)) {
          score += 20;
          break;
        }
      }
    }

    // 2. Activity / Expertise match (30 points max)
    if (activities.length > 0) {
      let matchedCount = 0;
      for (const act of activities) {
        if (gSpecsLower.some(spec => spec.includes(act) || act.includes(spec))) {
          matchedCount++;
        }
      }
      const matchRatio = matchedCount / activities.length;
      score += Math.round(matchRatio * 30);
    } else {
      score += 15; // default neutral score
    }

    // 3. Rating & reviews score (20 points max)
    const ratingScore = (Number(g.rating || 4.5) / 5) * 20;
    score += Math.round(ratingScore);

    // 4. Budget compatibility (10 points max)
    if (budget && Number(budget) > 0) {
      const dailyRate = Number(g.hourly_rate || 25) * 6; // assume 6hr guide day
      if (dailyRate <= Number(budget)) {
        score += 10;
      } else {
        score += 5;
      }
    } else {
      score += 5;
    }

    return {
      ...g,
      languages: typeof g.languages === 'string' ? JSON.parse(g.languages) : g.languages,
      specializations: typeof g.specializations === 'string' ? JSON.parse(g.specializations) : g.specializations,
      matchScore: score
    };
  });

  // Sort by match score descending
  scoredGuides.sort((a, b) => b.matchScore - a.matchScore);

  return scoredGuides;
}
