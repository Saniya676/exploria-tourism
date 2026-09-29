import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'exploria_super_secret_jwt_key_2026_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'exploria_db'
  },
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || 'faq',
  aiApiKey: process.env.AI_API_KEY || ''
};
