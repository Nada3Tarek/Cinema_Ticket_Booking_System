const BookingKeeper = require('../services/booking.services/BookingKeeper');
const bookingKeeper = new BookingKeeper();

exports.reserveSeats = async (req, res) => {
  try {
    const { userId, showId, seats, totalPrice } = req.body;

    const result = await bookingKeeper.reserveSeats(userId, showId, seats, totalPrice);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, userId, method, extra } = req.body;

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

exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await bookingKeeper.getUserBookings(userId);
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPendingBookings = async (req, res) => {
  try {
    const { userId } = req.params;
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
