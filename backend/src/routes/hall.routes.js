const express = require('express');
const router = express.Router();
const hallController = require('../controller/hall.controller');
//const { isAdmin } = require('../middlewares/auth.middleware');

router.post('/', 
   // isAdmin, 
    hallController.createHall);
router.patch('/:hallId',
    // isAdmin,
      hallController.editHall);
router.delete('/:hallId', 
   // isAdmin, 
    hallController.removeHall);

module.exports = router;
