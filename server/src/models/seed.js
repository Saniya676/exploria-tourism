import { initDatabase, query } from '../config/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('[Seed] Starting database re-seed...');
  await initDatabase();
  
  const defaultPassword = await bcrypt.hash('password123', 10);
  console.log('[Seed] Generated default hashed password:', defaultPassword);

  // Update users table with standard BCrypt password hash for quick demo testing
  await query(`UPDATE users SET password = ?`, [defaultPassword]);

  console.log('[Seed] Database re-seeded successfully with demo account passwords!');
  process.exit(0);
}

seed().catch(err => {
  console.error('[Seed] Error re-seeding database:', err);
  process.exit(1);
});
