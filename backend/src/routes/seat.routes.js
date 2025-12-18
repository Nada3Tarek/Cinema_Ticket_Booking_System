const express = require('express');
const router = express.Router();
const seatController = require('../controller/seat.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/lock',
     requireAuth, 
     seatController.lockSeats);
router.post('/unlock',
     requireAuth, 
      seatController.unlockSeats);
router.post('/book', 
     requireAuth, 
    seatController.bookSeats);

module.exports = router;
