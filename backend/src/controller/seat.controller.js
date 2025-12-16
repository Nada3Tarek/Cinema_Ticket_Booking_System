const SeatService = require('../services/seat.service');

// Lock seats
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
