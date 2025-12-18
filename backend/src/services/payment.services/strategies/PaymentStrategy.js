class PaymentStrategy {
  async pay({ amount, userId, bookingId }) {
    throw new Error("pay() must be implemented");
  }
}
module.exports = PaymentStrategy;
