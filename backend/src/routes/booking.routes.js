const express = require('express');
const router = express.Router();
const BookingController = require('../controller/booking.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/reserve',requireAuth, BookingController.reserveSeats);
router.post('/confirm', requireAuth,BookingController.confirmBooking);
router.post('/cancel',requireAuth, BookingController.cancelBooking);
router.get('/show/:showId',requireAuth, BookingController.getShowIdForBooking);

router.get('/user',requireAuth, BookingController.getUserBookings);
router.get('/pending',requireAuth, BookingController.getPendingBookings);
router.get('/:bookingId',requireAuth, BookingController.getBookingDetails);

module.exports = router;
