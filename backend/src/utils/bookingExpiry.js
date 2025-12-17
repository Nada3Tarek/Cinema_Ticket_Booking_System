function isBookingExpired(booking, timeoutMinutes = 15) {
  return Date.now() >
    booking.createdAt.getTime() + timeoutMinutes * 60 * 1000;
}

module.exports = { isBookingExpired };
