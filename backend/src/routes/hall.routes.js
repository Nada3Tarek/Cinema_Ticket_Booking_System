const express = require('express');
const router = express.Router();
const hallController = require('../controller/hall.controller');
const { requireAuth, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', 
    requireAuth, isAdmin, 
    hallController.createHall);
router.patch('/:hallId',
      requireAuth, isAdmin,
      hallController.editHall);
router.delete('/:hallId', 
    requireAuth, isAdmin, 
    hallController.removeHall);
router.get('/', requireAuth, isAdmin,hallController.getHalls);
router.get('/available', requireAuth, isAdmin,hallController.getAvailableHalls); 


module.exports = router;
