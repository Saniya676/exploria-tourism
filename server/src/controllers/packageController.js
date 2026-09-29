import { query, queryOne } from '../config/db.js';

export async function getAllPackages(req, res, next) {
  try {
    const { search, destinationId, difficulty, minPrice, maxPrice, sortBy, featured } = req.query;
    
    let sql = `
      SELECT p.*, d.name AS destination_name, d.country_state, a.name AS adventure_name
      FROM packages p
      JOIN destinations d ON p.destination_id = d.id
      LEFT JOIN adventures a ON p.adventure_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR d.name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (destinationId) {
      sql += ' AND p.destination_id = ?';
      params.push(destinationId);
    }

    if (difficulty) {
      sql += ' AND p.difficulty = ?';
      params.push(difficulty);
    }

    if (featured === 'true') {
      sql += ' AND p.featured = 1';
    }

    if (minPrice) {
      sql += ' AND p.price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(Number(maxPrice));
    }

    if (sortBy === 'price_asc') {
      sql += ' ORDER BY p.price ASC';
    } else if (sortBy === 'price_desc') {
      sql += ' ORDER BY p.price DESC';
    } else if (sortBy === 'rating') {
      sql += ' ORDER BY p.rating DESC';
    } else {
      sql += ' ORDER BY p.featured DESC, p.rating DESC, p.created_at DESC';
    }

    const packages = await query(sql, params);

    const formatted = packages.map(pkg => ({
      ...pkg,
      included_services: typeof pkg.included_services === 'string' ? JSON.parse(pkg.included_services) : pkg.included_services,
      excluded_services: typeof pkg.excluded_services === 'string' ? JSON.parse(pkg.excluded_services) : pkg.excluded_services
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

export async function getPackageById(req, res, next) {
  try {
    const { id } = req.params;

    const pkg = await queryOne(
      `SELECT p.*, d.name AS destination_name, d.country_state, a.name AS adventure_name, a.safety_info, a.required_equipment
       FROM packages p
       JOIN destinations d ON p.destination_id = d.id
       LEFT JOIN adventures a ON p.adventure_id = a.id
       WHERE p.id = ?`,
      [id]
    );

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    pkg.included_services = typeof pkg.included_services === 'string' ? JSON.parse(pkg.included_services) : pkg.included_services;
    pkg.excluded_services = typeof pkg.excluded_services === 'string' ? JSON.parse(pkg.excluded_services) : pkg.excluded_services;

    const itineraries = await query('SELECT * FROM package_itineraries WHERE package_id = ? ORDER BY day_number ASC', [id]);
    const reviews = await query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.package_id = ? ORDER BY r.created_at DESC`,
      [id]
    );

    // Available guides in this destination
    const guides = await query(
      `SELECT g.*, u.name, u.avatar, u.email FROM guides g
       JOIN users u ON g.user_id = u.id
       WHERE g.location LIKE ?`,
      [`%${pkg.destination_name}%`]
    );

    res.json({
      success: true,
      data: {
        ...pkg,
        itineraries,
        reviews,
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

export async function createPackage(req, res, next) {
  try {
    const { destination_id, adventure_id, title, cover_image, description, duration_days, price, difficulty, best_season, included_services, excluded_services, max_participants, featured, itineraries } = req.body;

    if (!destination_id || !title || !cover_image || !price || !description) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const incJson = Array.isArray(included_services) ? JSON.stringify(included_services) : JSON.stringify([]);
    const excJson = Array.isArray(excluded_services) ? JSON.stringify(excluded_services) : JSON.stringify([]);

    const result = await query(
      `INSERT INTO packages (destination_id, adventure_id, title, cover_image, description, duration_days, price, difficulty, best_season, included_services, excluded_services, max_participants, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [destination_id, adventure_id || null, title, cover_image, description, duration_days || 3, price, difficulty || 'Moderate', best_season || 'Round the year', incJson, excJson, max_participants || 15, featured ? 1 : 0]
    );

    const packageId = result.insertId;

    if (Array.isArray(itineraries) && itineraries.length > 0) {
      for (const item of itineraries) {
        await query(
          'INSERT INTO package_itineraries (package_id, day_number, title, description) VALUES (?, ?, ?, ?)',
          [packageId, item.day_number || 1, item.title, item.description]
        );
      }
    }

    const newPkg = await queryOne('SELECT * FROM packages WHERE id = ?', [packageId]);
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: newPkg
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePackage(req, res, next) {
  try {
    const { id } = req.params;
    const { destination_id, adventure_id, title, cover_image, description, duration_days, price, difficulty, best_season, included_services, excluded_services, max_participants, featured, rating } = req.body;

    const existing = await queryOne('SELECT id FROM packages WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const incJson = included_services ? (Array.isArray(included_services) ? JSON.stringify(included_services) : included_services) : undefined;
    const excJson = excluded_services ? (Array.isArray(excluded_services) ? JSON.stringify(excluded_services) : excluded_services) : undefined;

    await query(
      `UPDATE packages SET 
        destination_id = COALESCE(?, destination_id),
        adventure_id = COALESCE(?, adventure_id),
        title = COALESCE(?, title),
        cover_image = COALESCE(?, cover_image),
        description = COALESCE(?, description),
        duration_days = COALESCE(?, duration_days),
        price = COALESCE(?, price),
        difficulty = COALESCE(?, difficulty),
        best_season = COALESCE(?, best_season),
        included_services = COALESCE(?, included_services),
        excluded_services = COALESCE(?, excluded_services),
        max_participants = COALESCE(?, max_participants),
        featured = COALESCE(?, featured),
        rating = COALESCE(?, rating)
       WHERE id = ?`,
      [destination_id, adventure_id, title, cover_image, description, duration_days, price, difficulty, best_season, incJson, excJson, max_participants, featured !== undefined ? (featured ? 1 : 0) : undefined, rating, id]
    );

    const updated = await queryOne('SELECT * FROM packages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Package updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deletePackage(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM packages WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    await query('DELETE FROM packages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
}
