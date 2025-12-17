const Seat = require('../../models/Seat');

class SeatAvailabilityBooking {
  async checkAvailability(showId, seatNumbers) {
    const seats = await Seat.find({
      showId,
      seatNumber: { $in: seatNumbers },
      status: { $ne: 'AVAILABLE' }
    });
    if (seats.length > 0) throw new Error('Some seats are not available');
    return true;
  }
}

module.exports = SeatAvailabilityBooking;
