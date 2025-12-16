const SeatService = require('../services/seat.service');

function startSeatReleaseScheduler(timeoutMinutes = 15) {
  setInterval(async () => {
    try {
      await SeatService.releaseExpiredLocks(timeoutMinutes);
      console.log(`Expired seat locks released at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('Error releasing expired seat locks:', err);
    }
  }, 60 * 1000); // every 1 minute
}

module.exports = startSeatReleaseScheduler;
