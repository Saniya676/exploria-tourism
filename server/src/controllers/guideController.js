import { query, queryOne } from '../config/db.js';
import { findMatchingGuides } from '../services/guideMatchingService.js';

export async function getAllGuides(req, res, next) {
  try {
    const { location, specialization, search } = req.query;

    let sql = `
      SELECT g.*, u.name, u.email, u.phone, u.avatar, u.bio
      FROM guides g
      JOIN users u ON g.user_id = u.id
      WHERE g.is_approved = 1
    `;
    const params = [];

    if (location) {
      sql += ' AND g.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (specialization) {
      sql += ' AND g.specializations LIKE ?';
      params.push(`%${specialization}%`);
    }

    if (search) {
      sql += ' AND (u.name LIKE ? OR g.location LIKE ? OR g.specializations LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY g.rating DESC, g.reviews_count DESC';

    const guides = await query(sql, params);

    const formatted = guides.map(g => ({
      ...g,
      languages: typeof g.languages === 'string' ? JSON.parse(g.languages) : g.languages,
      specializations: typeof g.specializations === 'string' ? JSON.parse(g.specializations) : g.specializations
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getGuideById(req, res, next) {
  try {
    const { id } = req.params;
    const guide = await queryOne(
      `SELECT g.*, u.name, u.email, u.phone, u.avatar, u.bio
       FROM guides g
       JOIN users u ON g.user_id = u.id
       WHERE g.id = ?`,
      [id]
    );

    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    guide.languages = typeof guide.languages === 'string' ? JSON.parse(guide.languages) : guide.languages;
    guide.specializations = typeof guide.specializations === 'string' ? JSON.parse(guide.specializations) : guide.specializations;

    // Fetch reviews for guide
    const reviews = await query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.guide_id = ? ORDER BY r.created_at DESC`,
      [id]
    );

    // Fetch availability
    const availability = await query('SELECT * FROM guide_availability WHERE guide_id = ?', [id]);

    res.json({
      success: true,
      data: {
        ...guide,
        reviews,
        availability
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function matchGuidesController(req, res, next) {
  try {
    const { destination, preferredActivities, budget, travelDates, travelersCount, specialRequirements } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required for guide matching' });
    }

    const matchedGuides = await findMatchingGuides({ destination, preferredActivities, budget });

    // Store guide matching request if user logged in
    let requestId = null;
    if (req.user) {
      const topGuide = matchedGuides.length > 0 ? matchedGuides[0].id : null;
      const actsStr = Array.isArray(preferredActivities) ? preferredActivities.join(', ') : (preferredActivities || '');
      
      const result = await query(
        `INSERT INTO guide_requests (user_id, guide_id, destination, travel_dates, preferred_activities, budget, travelers_count, special_requirements, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, topGuide, destination, travelDates || 'TBD', actsStr, budget || 0, travelersCount || 1, specialRequirements || '', matchedGuides.length > 0 ? 'MATCHED' : 'PENDING']
      );
      requestId = result.insertId;
    }

    res.json({
      success: true,
      message: `Found ${matchedGuides.length} suitable guide matches`,
      requestId,
      data: matchedGuides
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGuideProfile(req, res, next) {
  try {
    const { location, experience_years, languages, specializations, hourly_rate, availability_status } = req.body;

    // Check if user is guide
    const guide = await queryOne('SELECT id FROM guides WHERE user_id = ?', [req.user.id]);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide profile not found for this user' });
    }

    const langsJson = languages ? (Array.isArray(languages) ? JSON.stringify(languages) : languages) : undefined;
    const specsJson = specializations ? (Array.isArray(specializations) ? JSON.stringify(specializations) : specializations) : undefined;

    await query(
      `UPDATE guides SET
        location = COALESCE(?, location),
        experience_years = COALESCE(?, experience_years),
        languages = COALESCE(?, languages),
        specializations = COALESCE(?, specializations),
        hourly_rate = COALESCE(?, hourly_rate),
        availability_status = COALESCE(?, availability_status)
       WHERE id = ?`,
      [location, experience_years, langsJson, specsJson, hourly_rate, availability_status, guide.id]
    );

    const updated = await queryOne('SELECT * FROM guides WHERE id = ?', [guide.id]);

    res.json({
      success: true,
      message: 'Guide profile updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function getGuideRequests(req, res, next) {
  try {
    const guide = await queryOne('SELECT id FROM guides WHERE user_id = ?', [req.user.id]);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide profile not found' });
    }

    const requests = await query(
      `SELECT gr.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.avatar as user_avatar
       FROM guide_requests gr
       JOIN users u ON gr.user_id = u.id
       WHERE gr.guide_id = ? OR gr.status = 'PENDING'
       ORDER BY gr.created_at DESC`,
      [guide.id]
    );

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
}

export async function respondGuideRequest(req, res, next) {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // ACCEPTED, REJECTED

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid response status' });
    }

    const guide = await queryOne('SELECT id FROM guides WHERE user_id = ?', [req.user.id]);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide profile not found' });
    }

    await query('UPDATE guide_requests SET status = ?, guide_id = ? WHERE id = ?', [status, guide.id, requestId]);

    res.json({ success: true, message: `Guide request ${status.toLowerCase()} successfully` });
  } catch (error) {
    next(error);
  }
}
