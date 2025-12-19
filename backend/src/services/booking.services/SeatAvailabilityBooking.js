const Seat = require('../../models/Seat');

class SeatAvailabilityBooking {
  async checkAvailability(showId, seatNumbers, userId) {
    const unavailableSeats = await Seat.find({
      showId,
      seatNumber: { $in: seatNumbers },
      $or: [
        { status: 'BOOKED' },
        { status: 'LOCKED', lockedBy: { $ne: userId } }
      ]
    });

    if (unavailableSeats.length > 0) {
      throw new Error('Some seats are already taken');
    }

    return true;
  }
}


module.exports = SeatAvailabilityBooking;
