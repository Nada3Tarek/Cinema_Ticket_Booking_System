const PaymentStrategy = require("./PaymentStrategy");

class CardPaymentStrategy extends PaymentStrategy {
  constructor(cardNumber, holderName) {
    super();
    this.cardNumber = cardNumber;
    this.holderName = holderName;
  }

  async pay({ amount }) {
    if (!amount || amount <= 0) return { success: false };
    return { success: true };
  }
}

module.exports = CardPaymentStrategy;
