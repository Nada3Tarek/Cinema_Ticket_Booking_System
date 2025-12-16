const express = require('express');
const router = express.Router();
const { postReview, getReviews, addLike, addReply } = require('../controller/ratingController');

// matnseh tzwdy al auth token
router.post('/', postReview);
router.get('/:movieId', getReviews);
router.post('/:reviewId/like', addLike);
router.post('/:reviewId/reply', addReply);

module.exports = router;
