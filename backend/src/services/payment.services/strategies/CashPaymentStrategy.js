const PaymentStrategy = require("./PaymentStrategy");

class CashPaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
  }

  async pay({ amount }) {
    if (!amount || amount <= 0) return { success: false };
    return { success: true };
  }
}

module.exports = CashPaymentStrategy;
