// src/app.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');

// Routes
const movieRoutes = require('./routes/movie.routes');
const showRoutes = require('./routes/show.routes');
const hallRoutes = require('./routes/hall.routes');
const seatRoutes = require('./routes/seat.routes');

const startSeatReleaseScheduler = require('./utils/seatScheduler');
const reviewRoutes = require('./routes/ratingRoutes');
const bookingRoutes = require('./routes/booking.routes');


const app = express();

// ====================
// MIDDLEWARES
// ====================

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====================
// HEALTH CHECK
// ====================

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ====================
// API ROUTES
// ====================

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/seats', seatRoutes);

// ====================
// ERROR HANDLING
// ====================

app.use(errorHandler);
// Mount review routes
app.use('/api/reviews', reviewRoutes);
// API Routes
app.use('/api/bookings', bookingRoutes);


// Error handling middleware (must be last)
//app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ====================
// SEAT RELEASE SCHEDULER
// ====================

startSeatReleaseScheduler(15);

module.exports = app;
