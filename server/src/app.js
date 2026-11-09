import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CodeMentor AI Server Running',
    timestamp: new Date().toISOString(),
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR',
  });
});

export default app;