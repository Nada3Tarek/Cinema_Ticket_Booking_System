const PaymentService = require("../services/payment/PaymentService");
const paymentService = new PaymentService();

/**
 * POST /api/payments/pay
 * body: { bookingId, userId, method: "CARD" | "WALLET" | "CASH" }
 */
exports.payForBooking = async (req, res) => {
  try {
    const { bookingId, userId, method } = req.body;

    if (!bookingId || !userId || !method) {
      return res.status(400).json({ error: "bookingId, userId, method are required" });
    }

    const result = await paymentService.payForBooking({ bookingId, userId, method });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
