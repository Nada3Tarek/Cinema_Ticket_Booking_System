const express = require('express');
const router = express.Router();
const showController = require('../controller/show.controller');
const { requireAuth, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', 
    requireAuth, isAdmin, 
    showController.createShow);
router.patch('/:showId',
    requireAuth, isAdmin, 
    showController.editShow);
router.delete('/:showId', 
    requireAuth, isAdmin,
    showController.removeShow);
router.patch('/:showId/status', 
    requireAuth, isAdmin,
    showController.setShowStatus);


module.exports = router;
