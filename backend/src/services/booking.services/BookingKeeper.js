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
    this.paymentService = paymentService;
  }

async reserveSeats(userId, showId, seatIds, totalPrice) {

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const show = await Show.findById(showId);
  if (!show) throw new Error('Show not found');

  const seats = await Seat.find({
    showId,
    seatNumber: { $in: seatIds }
  });

  if (seats.length !== seatIds.length) {
    throw new Error('Some seats do not exist for this show');
  }

  const calculatedTotal = seats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );

  if (calculatedTotal !== totalPrice) {
    throw new Error(
      `Invalid total price. Expected ${calculatedTotal}, received ${totalPrice}`
    );
  }

await this.seatAvailability.checkAvailability(showId, seatIds, userId);

  const seatObjectIds = seats.map(seat => seat._id);

  await this.seatService.lockSeats({
    seatIds: seatObjectIds,
    userId
  });

  return await this.bookingCreation.createBooking(
    userId,
    showId,
    seatObjectIds,
    totalPrice
  );
}


async confirmBooking(bookingId, userId, method, extra = {}) {

  const booking = await this.bookingCreation.getBookingById(bookingId);
  if (!booking) throw new Error('Booking not found');

  if (booking.status !== 'PENDING')
    throw new Error(`Cannot confirm ${booking.status} booking`);


  if (isBookingExpired(booking)) {
    await this.bookingCreation.expireBooking(bookingId);
    await this.seatService.unlockSeats(booking.seats);
    throw new Error('Booking expired');
  }
  const ALLOWED_METHODS = ["CARD", "WALLET", "CASH"];

  if (!ALLOWED_METHODS.includes(method)) {
    throw new Error(`Invalid payment method: ${method}`);
  }

  const payRes = await this.paymentService.processPayment({
    bookingId,
    userId,
    method,                 // CARD | WALLET | CASH
    amount: booking.totalPrice,
    extra                  // optional card data
  });

  if (!payRes.success) throw new Error('Payment not successful');

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
    const booking = await this.bookingCreation.getBookingDetails(bookingId);
    if (!booking) throw new Error('Booking not found');

    return booking;
  }

  async getShowWithSeats(showId) {
    const show = await Show.findById(showId)
      .populate('hallId')
      .populate('movieId');

    if (!show) throw new Error('Show not found');

    const seats = await Seat.find({ showId: show._id })
      .select('seatNumber status price');

    return { ...show.toObject(), seats };
  }
}

module.exports = BookingKeeper;
