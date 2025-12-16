const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  likeCount: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0 },
  replies: [
    {
      userId: { type: String, required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

class ReviewDecorator {
  constructor(review) {
    this.review = review;
  }

  addLike() {
    this.review.likeCount += 1;
  }

  addReply(userId, text) {
    this.review.replyCount += 1;
    this.review.replies.push({ userId, text });
  }

  getReviewDetails() {
    return {
      ...this.review.toObject(),
      likeCount: this.review.likeCount,
      replyCount: this.review.replyCount,
      replies: this.review.replies
    };
  }
}

module.exports = { Review, ReviewDecorator };
