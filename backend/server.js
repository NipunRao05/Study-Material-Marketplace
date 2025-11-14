import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './config/db.js';

import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Test DB connection
// app.get('/api/test-db', async (req, res) => {
//   try {
//     const connection = await db.getConnection();
//     await connection.ping();
//     connection.release();
//     res.json({ status: 'Database connection successful' });
//   } catch (error) {
//     res.status(500).json({ error: 'Database connection failed', message: error.message });
//   }
// });
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DATABASE() AS currentDB;");
    res.json({ message: "Connected!", currentDB: rows[0].currentDB });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    status: 500,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("DB Host:", process.env.DB_HOST);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
