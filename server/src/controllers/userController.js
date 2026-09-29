import { query, queryOne } from '../config/db.js';

export async function getAllUsers(req, res, next) {
  try {
    const { role, search } = req.query;

    let sql = 'SELECT id, name, email, phone, role, avatar, bio, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const users = await query(sql, params);
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'GUIDE', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const existing = await queryOne('SELECT id, role FROM users WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    // If upgraded to GUIDE, ensure guide record exists
    if (role === 'GUIDE') {
      const gCheck = await queryOne('SELECT id FROM guides WHERE user_id = ?', [id]);
      if (!gCheck) {
        await query(
          `INSERT INTO guides (user_id, location, experience_years, languages, specializations, hourly_rate, rating)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, 'General Location', 1, JSON.stringify(['English']), JSON.stringify(['Tour Guide']), 25.00, 5.00]
        );
      }
    }

    const updated = await queryOne('SELECT id, name, email, phone, role FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: `User role updated to ${role}`, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM users WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (Number(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}
