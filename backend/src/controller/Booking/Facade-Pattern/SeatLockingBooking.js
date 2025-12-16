const Seat = require('../../../models/Seat');

class SeatLockingBooking {
  async lockSeats(showId, seatNumbers, userId) {
    await Seat.updateMany(
      { showId, seatNumber: { $in: seatNumbers }, status: 'AVAILABLE' },
      { status: 'LOCKED', lockedAt: new Date() }
    );
    return { showId, seatNumbers };
  }

  async confirmSeats(booking) {
    await Seat.updateMany(
      { showId: booking.showId, seatNumber: { $in: booking.seats } },
      { status: 'BOOKED' }
    );
  }

  async cancelSeats(booking) {
    await Seat.updateMany(
      { showId: booking.showId, seatNumber: { $in: booking.seats } },
      { status: 'AVAILABLE', lockedAt: null }
    );
  }
}

module.exports = SeatLockingBooking;
