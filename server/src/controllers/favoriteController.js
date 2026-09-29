import { query, queryOne } from '../config/db.js';

export async function getUserFavorites(req, res, next) {
  try {
    const favorites = await query(
      `SELECT f.id as favorite_id, p.*, d.name as destination_name
       FROM favorites f
       JOIN packages p ON f.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    const formatted = favorites.map(pkg => ({
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

export async function toggleFavorite(req, res, next) {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ success: false, message: 'Package ID is required' });
    }

    const existing = await queryOne('SELECT id FROM favorites WHERE user_id = ? AND package_id = ?', [req.user.id, packageId]);

    if (existing) {
      await query('DELETE FROM favorites WHERE id = ?', [existing.id]);
      return res.json({
        success: true,
        message: 'Package removed from saved favorites',
        isSaved: false
      });
    } else {
      await query('INSERT INTO favorites (user_id, package_id) VALUES (?, ?)', [req.user.id, packageId]);
      return res.status(201).json({
        success: true,
        message: 'Package saved to your favorites',
        isSaved: true
      });
    }
  } catch (error) {
    next(error);
  }
}
