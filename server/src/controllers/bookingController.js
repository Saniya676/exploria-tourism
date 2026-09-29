import { query, queryOne } from '../config/db.js';

function generateBookingCode() {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const numStr = Math.floor(1000 + Math.random() * 9000);
  return `BK-${randomStr}${numStr}`;
}

export async function createBooking(req, res, next) {
  try {
    const { package_id, guide_id, travel_date, travelers_count, special_notes } = req.body;

    if (!package_id || !travel_date) {
      return res.status(400).json({ success: false, message: 'Package and travel date are required' });
    }

    const pkg = await queryOne('SELECT id, price, title FROM packages WHERE id = ?', [package_id]);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const count = Number(travelers_count) || 1;
    const total_amount = Number(pkg.price) * count;
    const booking_code = generateBookingCode();

    const result = await query(
      `INSERT INTO bookings (booking_code, user_id, package_id, guide_id, travel_date, travelers_count, total_amount, status, payment_status, special_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', 'DEMO_PAID', ?)`,
      [booking_code, req.user.id, package_id, guide_id || null, travel_date, count, total_amount, special_notes || '']
    );

    // Trigger Notification
    const { createNotification } = await import('./notificationController.js');
    await createNotification(
      req.user.id,
      'Booking Confirmed!',
      `Your reservation for ${pkg.title} (${booking_code}) has been confirmed. Total: $${total_amount}`,
      'BOOKING'
    );

    const created = await queryOne(
      `SELECT b.*, p.title as package_title, p.cover_image as package_image 
       FROM bookings b 
       JOIN packages p ON b.package_id = p.id 
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Booking completed successfully!',
      data: created
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserBookings(req, res, next) {
  try {
    const bookings = await query(
      `SELECT b.*, p.title as package_title, p.cover_image, p.duration_days, d.name as destination_name, g_u.name as guide_name
       FROM bookings b
       JOIN packages p ON b.package_id = p.id
       JOIN destinations d ON p.destination_id = d.id
       LEFT JOIN guides g ON b.guide_id = g.id
       LEFT JOIN users g_u ON g.user_id = g_u.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
}

export async function getGuideBookings(req, res, next) {
  try {
    const guide = await queryOne('SELECT id FROM guides WHERE user_id = ?', [req.user.id]);
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide profile not found' });
    }

    const bookings = await query(
      `SELECT b.*, p.title as package_title, p.cover_image, u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM bookings b
       JOIN packages p ON b.package_id = p.id
       JOIN users u ON b.user_id = u.id
       WHERE b.guide_id = ?
       ORDER BY b.created_at DESC`,
      [guide.id]
    );

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function getAllBookings(req, res, next) {
  try {
    const { status, search } = req.query;

    let sql = `
      SELECT b.*, p.title as package_title, u.name as user_name, u.email as user_email, d.name as destination_name
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN users u ON b.user_id = u.id
      JOIN destinations d ON p.destination_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND b.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (b.booking_code LIKE ? OR u.name LIKE ? OR p.title LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY b.created_at DESC';

    const bookings = await query(sql, params);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const existing = await queryOne('SELECT id, user_id FROM bookings WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check authorization if user trying to update own booking
    if (req.user.role === 'USER' && existing.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
    }

    await query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    const updated = await queryOne('SELECT * FROM bookings WHERE id = ?', [id]);

    res.json({ success: true, message: `Booking status changed to ${status}`, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await queryOne('SELECT id, user_id FROM bookings WHERE id = ?', [id]);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'ADMIN' && booking.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    await query("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?", [id]);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
}
