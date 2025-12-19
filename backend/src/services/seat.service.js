const Seat = require('../models/Seat');
const Booking = require('../models/Booking'); 

class SeatService {

  static async lockSeats({ seatIds, userId }) {
    const now = new Date();

    const unavailableSeats = await Seat.find({
      _id: { $in: seatIds },
      $or: [
        { status: 'BOOKED' },
        { status: 'LOCKED', lockedBy: { $ne: userId } }
      ] 
    });

    if (unavailableSeats.length > 0) {
      throw new Error('Some seats are already locked or booked');
    }

    const lockedSeats = await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: 'LOCKED', lockedAt: now, lockedBy: userId } },
      { new: true }
    );

    return lockedSeats;
  }

  static async unlockSeats(seatIds) {
    await Seat.updateMany(
      { _id: { $in: seatIds }, status: 'LOCKED' },
      { $set: { status: 'AVAILABLE', lockedAt: null, lockedBy: null } }
    );
  }

  static async releaseExpiredLocks(timeoutMinutes = 15) {
  const expiry = new Date(Date.now() - timeoutMinutes * 60 * 1000);

  // Find all pending bookings older than timeout
  const expiredBookings = await Booking.find({
    status: 'PENDING',
    createdAt: { $lt: expiry }
  });

  for (const booking of expiredBookings) {
    // Expire booking
    booking.status = 'EXPIRED';
    await booking.save();

    // Release seats
    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      { status: 'AVAILABLE', lockedAt: null, lockedBy: null }
    );

    console.log(`Booking ${booking._id} expired and seats released`);
  }
}


  static async bookSeats(seatIds, userId) {
    const bookedSeats = await Seat.updateMany(
      { _id: { $in: seatIds }, status: 'LOCKED', lockedBy: userId },
      { $set: { status: 'BOOKED', lockedAt: null, lockedBy: null } }
    );

    return bookedSeats;
  }
}

module.exports = SeatService;
