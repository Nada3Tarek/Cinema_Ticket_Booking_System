const ReviewSortingStrategy = require("./ReviewSortingStrategy");

class SortByRating extends ReviewSortingStrategy {
  sort(reviews) {
    return reviews.sort((a, b) => b.rating - a.rating);
  }
}

module.exports = SortByRating;
