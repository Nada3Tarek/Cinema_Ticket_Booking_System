const express = require('express');
const router = express.Router();
const { postReview, getReviews, addLike, addReply } = require('../controller/ratingController');
const { requireAuth } = require('../middlewares/auth.middleware');

// matnseh tzwdy al auth token
router.post('/',requireAuth, postReview);
router.get('/:movieId',requireAuth, getReviews);
router.post('/:reviewId/like',requireAuth, addLike);
router.post('/:reviewId/reply',requireAuth, addReply);

module.exports = router;
