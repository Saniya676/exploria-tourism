import { query, queryOne } from '../config/db.js';

export async function createReview(req, res, next) {
  try {
    const { package_id, guide_id, destination_id, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const result = await query(
      `INSERT INTO reviews (user_id, package_id, guide_id, destination_id, rating, comment)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, package_id || null, guide_id || null, destination_id || null, Number(rating), comment.trim()]
    );

    // Recalculate average rating if package_id specified
    if (package_id) {
      const avgRes = await queryOne('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE package_id = ?', [package_id]);
      if (avgRes) {
        await query('UPDATE packages SET rating = ?, reviews_count = ? WHERE id = ?', [Number(avgRes.avg_rating).toFixed(2), avgRes.count, package_id]);
      }
    }

    const created = await queryOne(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar FROM reviews r
       JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
}

export async function getReviews(req, res, next) {
  try {
    const { packageId, guideId, destinationId } = req.query;

    let sql = `
      SELECT r.*, u.name as user_name, u.avatar as user_avatar, p.title as package_title, d.name as destination_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN packages p ON r.package_id = p.id
      LEFT JOIN destinations d ON r.destination_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (packageId) {
      sql += ' AND r.package_id = ?';
      params.push(packageId);
    }
    if (guideId) {
      sql += ' AND r.guide_id = ?';
      params.push(guideId);
    }
    if (destinationId) {
      sql += ' AND r.destination_id = ?';
      params.push(destinationId);
    }

    sql += ' ORDER BY r.created_at DESC';

    const reviews = await query(sql, params);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const review = await queryOne('SELECT id, user_id FROM reviews WHERE id = ?', [id]);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (req.user.role !== 'ADMIN' && review.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await query('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
}
