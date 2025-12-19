const Payment = require("../../models/Payment");
const PaymentContext = require("./PaymentContext");

class PaymentService {
  async processPayment({ bookingId, userId, method, amount, extra = {} }) {
    // create payment record (PENDING)
    const payment = await Payment.create({
      bookingId,
      amount,
      method,
      status: "PENDING",
    });

    const context = new PaymentContext(method, userId, extra);
    const result = await context.pay({ amount, userId, bookingId });

    payment.status = result.success ? "SUCCESS" : "FAILED";
    await payment.save();

    return { success: result.success, payment };
  }
}

module.exports = PaymentService;
