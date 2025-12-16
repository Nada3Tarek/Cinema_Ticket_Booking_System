const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  seatNumber: {
    type: String, // A1, B5
    required: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'LOCKED', 'BOOKED'],
    default: 'AVAILABLE'
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lockedAt: Date,
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });


seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);