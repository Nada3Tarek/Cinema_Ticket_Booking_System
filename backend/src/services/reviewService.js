const { Review, ReviewDecorator } = require('../models/review');

class ReviewSortingStrategy {
  sort(reviews) { throw new Error('sort method should be implemented'); }
}

class SortByRating extends ReviewSortingStrategy {
  sort(reviews) { return reviews.sort((a,b) => b.rating - a.rating); }
}

class SortByDate extends ReviewSortingStrategy {
  sort(reviews) { return reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); }
}

class SortByPopularity extends ReviewSortingStrategy {
  sort(reviews) { return reviews.sort((a,b) => b.likeCount - a.likeCount); }
}

class ReviewService {
  async createReview(data) {
    const review = new Review(data);
    await review.save();
    const decorated = new ReviewDecorator(review);
    return decorated.getReviewDetails();
  }

  async getReviews({ movieId, page = 1, limit = 10, sortBy = 'date' }) {
    const skip = (page - 1) * limit;
    let reviews = await Review.find({ movieId }).skip(skip).limit(limit);

    let strategy;
    switch(sortBy) {
      case 'rating': strategy = new SortByRating(); break;
      case 'popularity': strategy = new SortByPopularity(); break;
      default: strategy = new SortByDate();
    }

    const sortedReviews = strategy.sort(reviews);

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum,r) => sum + r.rating, 0) / reviews.length
      : 0;

    return { avgRating, reviews: sortedReviews };
  }

  async addLike(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) throw new Error('Review not found');

    const decorated = new ReviewDecorator(review);
    decorated.addLike();
    await review.save();
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
}

module.exports = { ReviewService, SortByRating, SortByDate, SortByPopularity };
