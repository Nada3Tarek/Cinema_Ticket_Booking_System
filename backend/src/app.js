const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const bookingRoutes = require('./routes/booking.routes');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

// API Routes
app.use('/api/bookings', bookingRoutes);


// Error handling middleware (must be last)
//app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = app;

