const User = require('../../models/User');
const Show = require('../../models/Show');
const Seat = require('../../models/Seat');
const BookingCreationBooking = require('./BookingCreationBooking');
const SeatAvailabilityBooking = require('./SeatAvailabilityBooking');
const SeatService = require('../seat.service'); 
const { isBookingExpired } = require('../../utils/bookingExpiry');
const PaymentService = require('../payment.services/PaymentService');
const paymentService = new PaymentService();

class BookingKeeper {
  constructor() {
    this.seatAvailability = new SeatAvailabilityBooking();
    this.bookingCreation = new BookingCreationBooking();
    this.seatService = SeatService;
  }

  async reserveSeats(userId, showId, seatIds, totalPrice) {

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const show = await Show.findById(showId);
    if (!show) throw new Error('Show not found');

    const seats = await Seat.find({ _id: { $in: seatIds }, showId });
    if (seats.length !== seatIds.length) {
      throw new Error('Some seats do not exist for this show');
    }

    await this.seatAvailability.checkAvailability(showId, seatIds);

    await this.seatService.lockSeats({ seatIds, userId });

    const booking = await this.bookingCreation.createBooking(
      userId, showId, seatIds, totalPrice
    );

    return booking;
  }


async confirmBooking(bookingId, userId, method, extra = {}) {

  const booking = await this.bookingCreation.getBookingById(bookingId);
  if (!booking) throw new Error('Booking not found');

  if (booking.status !== 'PENDING')
    throw new Error(`Cannot confirm ${booking.status} booking`);

  // expiry logic (زي ما هو)
  if (isBookingExpired(booking)) {
    await this.bookingCreation.expireBooking(bookingId);
    await this.seatService.unlockSeats(booking.seats);
    throw new Error('Booking expired');
  }

  // ✅ هنا Strategy Payment (بدل paymentSuccess)
  const payRes = await paymentService.processPayment({
    bookingId,
    userId,
    method,                 // CARD | WALLET | CASH
    amount: booking.totalPrice,
    extra                  // optional card data
  });

  if (!payRes.success) throw new Error('Payment not successful');

  // نفس منطقك: بعد نجاح الدفع نحجز المقاعد ونأكد الحجز
  await this.seatService.bookSeats(booking.seats, booking.userId);
  return await this.bookingCreation.confirmBooking(bookingId);
}

async cancelBooking(bookingId) {
  const booking = await this.bookingCreation.getBookingById(bookingId);
  if (!booking) throw new Error('Booking not found');

  if (booking.status !== 'PENDING')
    throw new Error(`Cannot cancel ${booking.status} booking`);

  if (isBookingExpired(booking)) {
    await this.bookingCreation.expireBooking(bookingId);
    await this.seatService.unlockSeats(booking.seats);
    throw new Error('Booking expired');
  }

  await this.seatService.unlockSeats(booking.seats);
  return await this.bookingCreation.cancelBooking(bookingId);
}


  // Get all bookings for a user
  async getUserBookings(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return this.bookingCreation.getUserBookings(userId);
  }

  // Get pending bookings for a user
  async getPendingBookings(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    return this.bookingCreation.getPendingBookings(userId);
  }

  // Get details of a specific booking
  async getBookingDetails(bookingId) {
    const booking = await this.bookingCreation.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');

    return booking;
  }
}

module.exports = BookingKeeper;
