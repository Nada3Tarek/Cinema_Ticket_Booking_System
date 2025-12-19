const mongoose = require('mongoose');
const startSeatReleaseScheduler = require('../utils/seatScheduler');

class Database {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      console.log('MongoDB already connected');
      return mongoose.connection;
    }

    try {
     await mongoose.connect(process.env.MONGO_URI);

      this.isConnected = true;
      console.log('MongoDB connected');

      startSeatReleaseScheduler(15);

      return mongoose.connection;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
}

const databaseInstance = new Database();
module.exports = databaseInstance;
