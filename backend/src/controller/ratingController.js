const { ReviewService } = require('../services/reviewService');

const reviewService = new ReviewService();

const postReview = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user?.id || "testUser"; 
    const review = await reviewService.createReview({ ...data, userId });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { page, limit, sortBy } = req.query;
    const result = await reviewService.getReviews({ movieId, page, limit, sortBy });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const addLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await reviewService.addLike(reviewId);
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { replyText } = req.body;
    const userId = req.user?.id || "testUser";
    const updatedReview = await reviewService.addReply(reviewId, userId, replyText);
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { postReview, getReviews, addLike, addReply };
