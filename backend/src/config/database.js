const mongoose = require('mongoose');
const startSeatReleaseScheduler = require('../utils/seatScheduler');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
    startSeatReleaseScheduler(15); // 15 min timeout

  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
