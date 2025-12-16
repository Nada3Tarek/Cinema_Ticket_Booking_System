
// src/app.js

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const movieRoutes = require('./routes/movie.routes');
const showRoutes = require('./routes/show.routes');
const hallRoutes = require('./routes/hall.routes');
const seatRoutes = require('./routes/seat.routes');

// Seat release scheduler
const startSeatReleaseScheduler = require('./utils/seatScheduler');

const app = express();

// ====================
// MIDDLEWARES
// ====================

app.use(cors({
  origin: 'http://localhost:4200', // adjust your frontend origin
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// HEALTH CHECK
// ====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

// ====================
// API ROUTES
// ====================

app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/seats', seatRoutes);

// ====================
// ERROR HANDLING
// ====================

// Must be after all routes
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ====================
// SEAT RELEASE SCHEDULER
// ====================

startSeatReleaseScheduler(15); // 15 min timeout for locked seats

module.exports = app;
