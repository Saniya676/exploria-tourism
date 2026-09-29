import { query, queryOne } from '../config/db.js';

export async function getAdminStats(req, res, next) {
  try {
    const totalUsers = await queryOne('SELECT COUNT(*) as count FROM users');
    const totalGuides = await queryOne('SELECT COUNT(*) as count FROM guides WHERE is_approved = 1');
    const totalPackages = await queryOne('SELECT COUNT(*) as count FROM packages');
    const totalDestinations = await queryOne('SELECT COUNT(*) as count FROM destinations');
    const totalBookings = await queryOne('SELECT COUNT(*) as count FROM bookings');
    const pendingInquiries = await queryOne("SELECT COUNT(*) as count FROM inquiries WHERE status = 'PENDING'");
    const totalRevenue = await queryOne("SELECT SUM(total_amount) as sum FROM bookings WHERE status != 'CANCELLED'");

    // Bookings over time
    const bookingsByStatus = await query(
      'SELECT status, COUNT(*) as count, SUM(total_amount) as total FROM bookings GROUP BY status'
    );

    // Popular destinations
    const popularDestinations = await query(
      `SELECT d.name, COUNT(b.id) as booking_count, SUM(b.total_amount) as total_revenue
       FROM destinations d
       LEFT JOIN packages p ON d.id = p.destination_id
       LEFT JOIN bookings b ON p.id = b.package_id
       GROUP BY d.id, d.name
       ORDER BY booking_count DESC
       LIMIT 5`
    );

    // Popular packages performance
    const packagePerformance = await query(
      `SELECT p.title, p.price, p.rating, COUNT(b.id) as total_bookings, COALESCE(SUM(b.total_amount), 0) as revenue
       FROM packages p
       LEFT JOIN bookings b ON p.id = b.package_id
       GROUP BY p.id, p.title, p.price, p.rating
       ORDER BY total_bookings DESC, p.rating DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers: totalUsers ? totalUsers.count : 0,
          totalGuides: totalGuides ? totalGuides.count : 0,
          totalPackages: totalPackages ? totalPackages.count : 0,
          totalDestinations: totalDestinations ? totalDestinations.count : 0,
          totalBookings: totalBookings ? totalBookings.count : 0,
          pendingInquiries: pendingInquiries ? pendingInquiries.count : 0,
          totalRevenue: totalRevenue && totalRevenue.sum ? Number(totalRevenue.sum) : 0
        },
        bookingsByStatus,
        popularDestinations,
        packagePerformance
      }
    });
  } catch (error) {
    next(error);
  }
}
