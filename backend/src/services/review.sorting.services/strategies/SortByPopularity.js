const ReviewSortingStrategy = require("./ReviewSortingStrategy");

class SortByPopularity extends ReviewSortingStrategy {
  sort(reviews) {
    return reviews.sort((a, b) => b.likeCount - a.likeCount);
  }
}

module.exports = SortByPopularity;
