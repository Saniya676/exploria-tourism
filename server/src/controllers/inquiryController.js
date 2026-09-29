import { query, queryOne } from '../config/db.js';

function generateInquiryRef() {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const numStr = Math.floor(1000 + Math.random() * 9000);
  return `EXP-${randomStr}${numStr}`;
}

export async function createInquiry(req, res, next) {
  try {
    const { name, email, phone, destination_id, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required fields'
      });
    }

    const reference_id = generateInquiryRef();
    const userId = req.user ? req.user.id : null;

    const result = await query(
      `INSERT INTO inquiries (reference_id, user_id, name, email, phone, destination_id, subject, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [reference_id, userId, name.trim(), email.toLowerCase().trim(), phone || '', destination_id || null, subject.trim(), message.trim()]
    );

    const createdInquiry = await queryOne('SELECT * FROM inquiries WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: `Inquiry submitted successfully. Reference ID: ${reference_id}`,
      data: createdInquiry
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllInquiries(req, res, next) {
  try {
    const { status, search } = req.query;

    let sql = `
      SELECT i.*, d.name AS destination_name 
      FROM inquiries i
      LEFT JOIN destinations d ON i.destination_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND i.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (i.name LIKE ? OR i.email LIKE ? OR i.reference_id LIKE ? OR i.subject LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY i.created_at DESC';

    const inquiries = await query(sql, params);
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserInquiries(req, res, next) {
  try {
    const inquiries = await query(
      `SELECT i.*, d.name AS destination_name 
       FROM inquiries i
       LEFT JOIN destinations d ON i.destination_id = d.id
       WHERE i.user_id = ? OR i.email = ?
       ORDER BY i.created_at DESC`,
      [req.user.id, req.user.email]
    );

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
}

export async function getInquiryById(req, res, next) {
  try {
    const { id } = req.params;
    const inquiry = await queryOne(
      `SELECT i.*, d.name AS destination_name 
       FROM inquiries i
       LEFT JOIN destinations d ON i.destination_id = d.id
       WHERE i.id = ? OR i.reference_id = ?`,
      [id, id]
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    next(error);
  }
}

export async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const existing = await queryOne('SELECT id FROM inquiries WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    const updated = await queryOne('SELECT * FROM inquiries WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteInquiry(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM inquiries WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await query('DELETE FROM inquiries WHERE id = ?', [id]);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
}
