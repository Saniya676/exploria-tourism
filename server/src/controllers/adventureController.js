import { query, queryOne } from '../config/db.js';

export async function getAllAdventures(req, res, next) {
  try {
    const { category, difficulty, destinationId, search } = req.query;

    let sql = `
      SELECT a.*, d.name AS destination_name, d.country_state 
      FROM adventures a
      JOIN destinations d ON a.destination_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ' AND a.category = ?';
      params.push(category);
    }

    if (difficulty) {
      sql += ' AND a.difficulty = ?';
      params.push(difficulty);
    }

    if (destinationId) {
      sql += ' AND a.destination_id = ?';
      params.push(destinationId);
    }

    if (search) {
      sql += ' AND (a.name LIKE ? OR a.description LIKE ? OR d.name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY a.name ASC';

    const adventures = await query(sql, params);
    res.json({
      success: true,
      count: adventures.length,
      data: adventures
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdventureById(req, res, next) {
  try {
    const { id } = req.params;
    const adventure = await queryOne(
      `SELECT a.*, d.name AS destination_name, d.country_state 
       FROM adventures a
       JOIN destinations d ON a.destination_id = d.id
       WHERE a.id = ?`,
      [id]
    );

    if (!adventure) {
      return res.status(404).json({ success: false, message: 'Adventure not found' });
    }

    const packages = await query('SELECT * FROM packages WHERE adventure_id = ?', [id]);
    const guides = await query(
      `SELECT g.*, u.name, u.avatar, u.email FROM guides g
       JOIN users u ON g.user_id = u.id
       WHERE g.location LIKE ? OR g.specializations LIKE ?`,
      [`%${adventure.destination_name}%`, `%${adventure.category}%`]
    );

    res.json({
      success: true,
      data: {
        ...adventure,
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

export async function createAdventure(req, res, next) {
  try {
    const { destination_id, name, category, description, duration, difficulty, price, best_time, safety_info, required_equipment, image_url } = req.body;

    if (!destination_id || !name || !category || !description || !price || !image_url) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const result = await query(
      `INSERT INTO adventures (destination_id, name, category, description, duration, difficulty, price, best_time, safety_info, required_equipment, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [destination_id, name, category, description, duration || '1 Day', difficulty || 'Moderate', price, best_time || 'Round the year', safety_info || 'Follow safety rules', required_equipment || 'Comfortable attire', image_url]
    );

    const newAdv = await queryOne('SELECT * FROM adventures WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Adventure created successfully', data: newAdv });
  } catch (error) {
    next(error);
  }
}

export async function updateAdventure(req, res, next) {
  try {
    const { id } = req.params;
    const { destination_id, name, category, description, duration, difficulty, price, best_time, safety_info, required_equipment, image_url } = req.body;

    const existing = await queryOne('SELECT id FROM adventures WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Adventure not found' });
    }

    await query(
      `UPDATE adventures SET
        destination_id = COALESCE(?, destination_id),
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        duration = COALESCE(?, duration),
        difficulty = COALESCE(?, difficulty),
        price = COALESCE(?, price),
        best_time = COALESCE(?, best_time),
        safety_info = COALESCE(?, safety_info),
        required_equipment = COALESCE(?, required_equipment),
        image_url = COALESCE(?, image_url)
       WHERE id = ?`,
      [destination_id, name, category, description, duration, difficulty, price, best_time, safety_info, required_equipment, image_url, id]
    );

    const updated = await queryOne('SELECT * FROM adventures WHERE id = ?', [id]);
    res.json({ success: true, message: 'Adventure updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdventure(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM adventures WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Adventure not found' });
    }

    await query('DELETE FROM adventures WHERE id = ?', [id]);
    res.json({ success: true, message: 'Adventure deleted successfully' });
  } catch (error) {
    next(error);
  }
}
