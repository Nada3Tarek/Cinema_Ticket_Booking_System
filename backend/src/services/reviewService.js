const { Review, ReviewDecorator } = require('../models/review');
const Movie = require('../models/Movie');
const ReviewSortingContext = require("../services/review.sorting.services/ReviewSortingContext");

class ReviewService {
  async createReview(data) {
    const review = new Review(data);
    await review.save();
    await this.updateMovieRating(review.movieId);
    const decorated = new ReviewDecorator(review);
    return decorated.getReviewDetails();
  }

 async getReviews({ movieId, page = 1, limit = 10, sortBy = "date" }) {
  const skip = (page - 1) * limit;

  let reviews = await Review.find({ movieId })
    .skip(skip)
    .limit(limit);

  const sortingContext = new ReviewSortingContext(sortBy);
  const sortedReviews = sortingContext.sort(reviews);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return { avgRating, reviews: sortedReviews };
}
  async addLike(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error('Review not found');

    const decorated = new ReviewDecorator(review);
    decorated.addLike();
    await review.save();
    await this.updateMovieRating(review.movieId);
    return decorated.getReviewDetails();
  }

  async addReply(reviewId, userId, text) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error('Review not found');

    const decorated = new ReviewDecorator(review);
    decorated.addReply(userId, text);
    await review.save();
    return decorated.getReviewDetails();
  }

   async updateMovieRating(movieId) {
    const reviews = await Review.find({ movieId });
    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Movie.findByIdAndUpdate(movieId, { rating: avgRating });
  }
}

module.exports = { ReviewService };

