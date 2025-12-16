const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: Number,
  method: {
    type: String,
    enum: ['CARD', 'WALLET', 'CASH']
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);