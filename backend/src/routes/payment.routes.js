const router = require("express").Router();
const paymentController = require("../controller/payment.controller");

router.post("/pay", paymentController.payForBooking);

module.exports = router;
