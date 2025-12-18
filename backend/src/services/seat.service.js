const Seat = require('../models/Seat');
const Booking = require('../models/Booking'); // add this

class SeatService {

  static async lockSeats({ seatIds, userId }) {
    const now = new Date();

    const unavailableSeats = await Seat.find({
      _id: { $in: seatIds },
      status: { $in: ['LOCKED', 'BOOKED'] }
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

    // await Seat.updateMany(
    //   { status: 'LOCKED', lockedAt: { $lt: expiry } },
    //   { $set: { status: 'AVAILABLE', lockedAt: null, lockedBy: null } }
    // );

  const seats = await Seat.find({
    status: 'LOCKED',
    lockedAt: { $lt: expiry }
  });

  for (const seat of seats) {
    // Check if the seat belongs to any PENDING booking
    const activeBooking = await Booking.findOne({
      seats: seat._id,
      status: 'PENDING'
    });

    // Only release if no active pending booking exists
    if (!activeBooking) {
      await Seat.updateOne(
        { _id: seat._id },
        { status: 'AVAILABLE', lockedAt: null, lockedBy: null }
      );
    }
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
