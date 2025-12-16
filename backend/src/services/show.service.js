const Show = require('../models/Show');
const Hall = require('../models/Hall');
const Seat = require('../models/Seat');
const SeatFactory = require('../factories/seat.factory');

class ShowService {
  static async createShow(data) {
    const { hallId, startTime, endTime } = data;

    // 1️⃣ Validate time
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('Start time must be before end time');
    }

    // 2️⃣ Check overlapping shows in same hall
    const overlappingShow = await Show.findOne({
      hallId,
      isActive: true,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (overlappingShow) {
      throw new Error('Hall already has a show during this time');
    }

    // 3️⃣ Get hall
    const hall = await Hall.findById(hallId);
    if (!hall) throw new Error('Hall not found');

    // 4️⃣ Create show
    const show = await Show.create({
      movieId: data.movieId,
      hallId,
      startTime,
      endTime,
      price: data.price,
      isActive: true
    });

    // 5️⃣ Generate seats
    const seats = SeatFactory.generateSeats({
      showId: show._id,
      hallId: hall._id,
      rows: hall.rows,
      columns: hall.columns,
      basePrice: data.price
    });

    await Seat.insertMany(seats);

    return show;
  }

  static async setActiveStatus(showId, isActive) {
    const show = await Show.findById(showId);
    if (!show) throw new Error('Show not found');

    show.isActive = isActive;
    await show.save();

    return show;
  }

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

module.exports = ShowService;
