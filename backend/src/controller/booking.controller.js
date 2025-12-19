const BookingKeeper = require('../services/booking.services/BookingKeeper');
const bookingKeeper = new BookingKeeper();
const Show = require('../models/Show');

exports.reserveSeats = async (req, res) => {
  try {
    const {showId, seats, totalPrice } = req.body;
    const userId = req.user?.id
    const result = await bookingKeeper.reserveSeats(userId, showId, seats, totalPrice);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getShowDetails = async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId).populate('movieId');
    if (!show) return res.status(404).json({ message: 'Show not found' });

    res.json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, method, extra } = req.body;
    const userId = req.user?.id
    const result = await bookingKeeper.confirmBooking(bookingId, userId, method, extra);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const result = await bookingKeeper.cancelBooking(bookingId);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getShowIdForBooking = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await BookingService.getShowWithSeats(showId);
    res.json(show);
  } catch (err) {
    console.error('Error in getShowIdForBooking:', err);
    res.status(500).json({ error: err.message });
  }
}


exports.getUserBookings = async (req, res) => {
  try {
     const userId = req.user?.id
    const bookings = await bookingKeeper.getUserBookings(userId);
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const userId = req.user?.id
    const bookings = await bookingKeeper.getPendingBookings(userId);
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingKeeper.getBookingDetails(bookingId);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
