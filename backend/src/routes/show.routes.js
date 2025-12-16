const express = require('express');
const router = express.Router();
const showController = require('../controller/show.controller');
//const { isAdmin } = require('../middlewares/auth.middleware');

router.post('/', 
    //isAdmin, 
    showController.createShow);
router.patch('/:showId',
    // isAdmin, 
    showController.editShow);
router.delete('/:showId', 
    //isAdmin,
    showController.removeShow);
router.patch('/:showId/status', 
    //isAdmin,
    showController.setShowStatus);


module.exports = router;
