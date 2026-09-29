import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { initDatabase } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import adventureRoutes from './routes/adventureRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import travelPlannerRoutes from './routes/travelPlannerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Enable CORS
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Exploria API is running'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/adventures', adventureRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/travel-planner', travelPlannerRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = config.port;

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`[Exploria Server] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[Exploria Server] Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[Exploria Server] Database initialization failed:', err);
    process.exit(1);
  }
}

startServer();
