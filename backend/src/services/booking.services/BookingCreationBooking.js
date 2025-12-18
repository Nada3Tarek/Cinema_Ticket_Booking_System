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
 // ----------------------------
  // Get all bookings for a user (list view)
  async getUserBookings(userId) {
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'showId',
        select: 'movieId hallId startTime endTime',
        populate: [
          { path: 'movieId', select: 'title' },
          { path: 'hallId', select: 'name'  ,model: 'Hall'}
        ]
      });

    return bookings.map(b => ({
      bookingId: b._id,
      movieTitle: b.showId?.movieId?.title || 'N/A',
      hallName: b.showId?.hallId?.name || 'N/A',
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt
    }));
  }

  // Get pending bookings for a user (list view)
  async getPendingBookings(userId) {
    const bookings = await Booking.find({ userId, status: 'PENDING' })
      .sort({ createdAt: -1 })
      .populate({
        path: 'showId',
        select: 'movieId hallId startTime endTime',
        populate: [
          { path: 'movieId', select: 'title' },
          { path: 'hallId', select: 'name' ,model: 'Hall'}
        ]
      });

    return bookings.map(b => ({
      bookingId: b._id,
      movieTitle: b.showId?.movieId?.title || 'N/A',
      hallName: b.showId?.hallId?.name || 'N/A',
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt
    }));
  }

  // Get details of a specific booking (full view)
  async getBookingDetails(bookingId) {
    const booking = await Booking.findById(bookingId)
      .populate({
        path: 'seats',
        select: 'seatNumber price',
      })
      .populate({
        path: 'showId',
        select: 'startTime endTime hallId movieId',
        populate: [
          { path: 'movieId', select: 'title poster duration' },
          { path: 'hallId', select: 'name' ,model: 'Hall'}
        ]
      });

    if (!booking) throw new Error('Booking not found');

    return {
      bookingId: booking._id,
      movieTitle: booking.showId?.movieId?.title || 'N/A',
      hallName: booking.showId?.hallId?.name || 'N/A',
      showStartTime: booking.showId?.startTime,
      showEndTime: booking.showId?.endTime,
      seats: booking.seats.map(seat => ({
        seatNumber: seat.seatNumber,
        price: seat.price
      })),
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt
    };
  }

}

module.exports = BookingCreationBooking;
