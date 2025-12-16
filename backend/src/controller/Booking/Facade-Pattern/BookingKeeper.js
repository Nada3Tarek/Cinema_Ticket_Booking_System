const SeatAvailabilityBooking = require('./SeatAvailabilityBooking');
const SeatLockingBooking = require('./SeatLockingBooking');
const BookingCreationBooking = require('./BookingCreationBooking');

class BookingKeeper {
  constructor() {
    this.seatAvailability = new SeatAvailabilityBooking();
    this.seatLocking = new SeatLockingBooking();
    this.bookingCreation = new BookingCreationBooking();
  }

  async reserveSeats(userId, showId, seatNumbers, totalPrice) {
    await this.seatAvailability.checkAvailability(showId, seatNumbers);
    const lockInfo = await this.seatLocking.lockSeats(showId, seatNumbers, userId);
    const booking = await this.bookingCreation.createBooking(userId, showId, seatNumbers, totalPrice);
    return { booking, lockInfo };
  }

  async confirmBooking(bookingId, paymentSuccess) {
    const booking = await this.bookingCreation.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'PENDING') throw new Error('Booking already confirmed or cancelled');
    if (!paymentSuccess) throw new Error('Cannot confirm booking without successful payment');

    const confirmedBooking = await this.bookingCreation.confirmBooking(bookingId);
    await this.seatLocking.confirmSeats(confirmedBooking);
    return confirmedBooking;
  }

  async cancelBooking(bookingId) {
    const booking = await this.bookingCreation.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'PENDING') throw new Error('Cannot cancel a confirmed or cancelled booking');

    const cancelledBooking = await this.bookingCreation.cancelBooking(bookingId);
    await this.seatLocking.cancelSeats(cancelledBooking);
    return cancelledBooking;
  }
}

module.exports = BookingKeeper;
