const CardPaymentStrategy = require("./strategies/CardPaymentStrategy");
const WalletPaymentStrategy = require("./strategies/WalletPaymentStrategy");
const CashPaymentStrategy = require("./strategies/CashPaymentStrategy");

class PaymentContext {
  constructor(method, userId, extra = {}) {
    if (method === "CARD") {
      this.strategy = new CardPaymentStrategy(
        extra.cardNumber || "0000-0000",
        extra.holderName || "User"
      );
    } else if (method === "WALLET") {
      this.strategy = new WalletPaymentStrategy(userId);
    } else if (method === "CASH") {
      this.strategy = new CashPaymentStrategy();
    } else {
      throw new Error("Invalid payment method");
    }
  }

  async pay(data) {
    return this.strategy.pay(data);
  }
}

module.exports = PaymentContext;
