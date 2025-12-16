const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: String,
  totalSeats: Number,
  rows: Number,
  columns: Number
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema);
