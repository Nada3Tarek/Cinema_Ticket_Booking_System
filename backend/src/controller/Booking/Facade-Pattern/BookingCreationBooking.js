const BookingModel = require('../../../models/Booking');

class BookingCreationBooking {
  async createBooking(userId, showId, seatNumbers, totalPrice) {
    const booking = await BookingModel.create({
      userId,
      showId,
      seats: seatNumbers,
      totalPrice,
      status: 'PENDING'
    });
    return booking;
  }

  async getBookingById(bookingId) {
    return await BookingModel.findById(bookingId);
  }

  async confirmBooking(bookingId) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: 'CONFIRMED' },
      { new: true }
    );
  }

  async cancelBooking(bookingId) {
    return await BookingModel.findByIdAndUpdate(
      bookingId,
      { status: 'CANCELLED' },
      { new: true }
    );
  }

  async getUserBookings(userId) {
    return await BookingModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getPendingBookings(userId) {
    return await BookingModel.find({ userId, status: 'PENDING' }).sort({ createdAt: -1 });
  }
}

module.exports = BookingCreationBooking;
