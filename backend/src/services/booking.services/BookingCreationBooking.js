const Booking = require('../../models/Booking');

class BookingCreationBooking {


  async getBookingById(bookingId) {
    return await Booking.findById(bookingId);
  }
  async createBooking(userId, showId, seatNumbers, totalPrice) {
    return Booking.create({
      userId,
      showId,
      seats: seatNumbers,
      totalPrice,
      status: 'PENDING'
    });
  }
  
async expireBooking(bookingId) {
    return Booking.findByIdAndUpdate(
      bookingId,
      { status: 'EXPIRED' },
      { new: true }
    );
  }

 async confirmBooking(bookingId) {
    return Booking.findByIdAndUpdate(
      bookingId,
      { status: 'CONFIRMED' },
      { new: true }
    );
  }

  async cancelBooking(bookingId) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'CANCELLED' },
      { new: true }
    );
    return booking;
  }

  async getUserBookings(userId) {
    return await Booking.find({ userId }).sort({ createdAt: -1 });
  }

  async getPendingBookings(userId) {
    return await Booking.find({ userId, status: 'PENDING' }).sort({ createdAt: -1 });
  }
}

module.exports = BookingCreationBooking;
