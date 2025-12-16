const express = require('express');
const router = express.Router();
const BookingController = require('../controller/Booking/booking.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

// / authMiddleware
router.post('/reserve', BookingController.reserveSeats);
router.post('/confirm', BookingController.confirmBooking);
router.post('/cancel', BookingController.cancelBooking);

router.get('/user/:userId', BookingController.getUserBookings);
router.get('/pending/:userId', BookingController.getPendingBookings);
router.get('/:bookingId', BookingController.getBookingDetails);

module.exports = router;
