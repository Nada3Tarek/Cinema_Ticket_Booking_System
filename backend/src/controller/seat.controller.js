const SeatService = require('../services/seat.service');
const Seat = require('../models/Seat');

exports.lockSeats = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { seatIds } = req.body;

    await SeatService.lockSeats({ seatIds, userId });
    res.status(200).json({ message: 'Seats locked successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.lockSeats = async (req, res, next) => {
//   try {
//     const { showId, seatNumbers, lockedBy } = req.body;

//     if (!lockedBy) {
//       return res.status(400).json({ success: false, message: 'lockedBy is required' });
//     }

//     // your locking logic, e.g.:
//     const seats = await Seat.updateMany(
//       { showId, seatNumber: { $in: seatNumbers }, status: 'AVAILABLE' },
//       { status: 'LOCKED', lockedAt: new Date(), lockedBy }
//     );

//     res.json({ success: true, message: 'Seats locked', seats });
//   } catch (err) {
//     next(err);
//   }
// };

// Unlock seats (optional manual cancel)
exports.unlockSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;
    await SeatService.unlockSeats(seatIds);
    res.status(200).json({ message: 'Seats unlocked successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Book seats after payment
exports.bookSeats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { seatIds } = req.body;

    await SeatService.bookSeats(seatIds, userId);
    res.status(200).json({ message: 'Seats booked successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
