const PaymentStrategy = require("./PaymentStrategy");

class WalletPaymentStrategy extends PaymentStrategy {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  async pay({ amount, userId }) {
    if (!userId) return { success: false };
    if (!amount || amount <= 0) return { success: false };
    return { success: true };
  }
}

module.exports = WalletPaymentStrategy;
