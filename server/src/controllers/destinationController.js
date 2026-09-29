import { query, queryOne } from '../config/db.js';

export async function getAllDestinations(req, res, next) {
  try {
    const { search, category, featured, maxPrice } = req.query;
    let sql = 'SELECT * FROM destinations WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR country_state LIKE ? OR description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (featured === 'true') {
      sql += ' AND featured = 1';
    }

    if (maxPrice) {
      sql += ' AND estimated_budget <= ?';
      params.push(Number(maxPrice));
    }

    sql += ' ORDER BY rating DESC, name ASC';

    const destinations = await query(sql, params);

    // Format JSON fields if needed
    const formatted = destinations.map(d => ({
      ...d,
      popular_activities: typeof d.popular_activities === 'string' ? JSON.parse(d.popular_activities) : d.popular_activities
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

export async function getDestinationById(req, res, next) {
  try {
    const { id } = req.params;
    const destination = await queryOne('SELECT * FROM destinations WHERE id = ?', [id]);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    destination.popular_activities = typeof destination.popular_activities === 'string'
      ? JSON.parse(destination.popular_activities)
      : destination.popular_activities;

    // Fetch related adventures, packages, and guides
    const adventures = await query('SELECT * FROM adventures WHERE destination_id = ?', [id]);
    const packages = await query('SELECT * FROM packages WHERE destination_id = ?', [id]);
    const guides = await query(
      `SELECT g.*, u.name, u.avatar, u.email FROM guides g 
       JOIN users u ON g.user_id = u.id 
       WHERE g.location LIKE ?`,
      [`%${destination.name}%`]
    );

    res.json({
      success: true,
      data: {
        ...destination,
        adventures,
        packages,
        guides: guides.map(g => ({
          ...g,
          languages: typeof g.languages === 'string' ? JSON.parse(g.languages) : g.languages,
          specializations: typeof g.specializations === 'string' ? JSON.parse(g.specializations) : g.specializations
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createDestination(req, res, next) {
  try {
    const { name, country_state, description, image_url, best_time, estimated_budget, popular_activities, featured } = req.body;

    if (!name || !country_state || !description || !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    const activitiesJson = Array.isArray(popular_activities) ? JSON.stringify(popular_activities) : JSON.stringify([popular_activities]);

    const result = await query(
      `INSERT INTO destinations (name, country_state, description, image_url, best_time, estimated_budget, popular_activities, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, country_state, description, image_url, best_time || 'Round the year', estimated_budget || 300, activitiesJson, featured ? 1 : 0]
    );

    const newDest = await queryOne('SELECT * FROM destinations WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: newDest
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDestination(req, res, next) {
  try {
    const { id } = req.params;
    const { name, country_state, description, image_url, best_time, estimated_budget, popular_activities, featured, rating } = req.body;

    const existing = await queryOne('SELECT id FROM destinations WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const activitiesJson = popular_activities ? (Array.isArray(popular_activities) ? JSON.stringify(popular_activities) : popular_activities) : undefined;

    await query(
      `UPDATE destinations SET 
        name = COALESCE(?, name),
        country_state = COALESCE(?, country_state),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        best_time = COALESCE(?, best_time),
        estimated_budget = COALESCE(?, estimated_budget),
        popular_activities = COALESCE(?, popular_activities),
        featured = COALESCE(?, featured),
        rating = COALESCE(?, rating)
       WHERE id = ?`,
      [name, country_state, description, image_url, best_time, estimated_budget, activitiesJson, featured !== undefined ? (featured ? 1 : 0) : undefined, rating, id]
    );

    const updated = await queryOne('SELECT * FROM destinations WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Destination updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDestination(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM destinations WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    await query('DELETE FROM destinations WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
