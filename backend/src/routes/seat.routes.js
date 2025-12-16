const express = require('express');
const router = express.Router();
const seatController = require('../controller/seat.controller');
//const { isAuthenticated } = require('../middlewares/auth.middleware');

router.post('/lock',
    // isAuthenticated, 
     seatController.lockSeats);
router.post('/unlock',
    // isAuthenticated, 
      seatController.unlockSeats);
router.post('/book', 
    //isAuthenticated, 
    seatController.bookSeats);

module.exports = router;
