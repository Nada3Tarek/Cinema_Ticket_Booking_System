const Seat = require('../models/Seat');

class SeatService {
  // Lock multiple seats for a user
  static async lockSeats({ seatIds, userId }) {
    const now = new Date();

    // 1️⃣ Check if any seat is already LOCKED or BOOKED
    const unavailableSeats = await Seat.find({
      _id: { $in: seatIds },
      status: { $in: ['LOCKED', 'BOOKED'] }
    });

    if (unavailableSeats.length > 0) {
      throw new Error('Some seats are already locked or booked');
    }

    // 2️⃣ Lock the seats
    const lockedSeats = await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: 'LOCKED', lockedAt: now, lockedBy: userId } },
      { new: true }
    );

    return lockedSeats;
  }

  // Unlock seats (manual or timeout)
  static async unlockSeats(seatIds) {
    await Seat.updateMany(
      { _id: { $in: seatIds }, status: 'LOCKED' },
      { $set: { status: 'AVAILABLE', lockedAt: null, lockedBy: null } }
    );
  }

  // Auto-unlock seats after timeout
  static async releaseExpiredLocks(timeoutMinutes = 15) {
    const expiry = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    await Seat.updateMany(
      { status: 'LOCKED', lockedAt: { $lt: expiry } },
      { $set: { status: 'AVAILABLE', lockedAt: null, lockedBy: null } }
    );
  }

  // Confirm booking
  static async bookSeats(seatIds, userId) {
    const bookedSeats = await Seat.updateMany(
      { _id: { $in: seatIds }, status: 'LOCKED', lockedBy: userId },
      { $set: { status: 'BOOKED', lockedAt: null, lockedBy: null } }
    );

    return bookedSeats;
  }
}

module.exports = SeatService;
