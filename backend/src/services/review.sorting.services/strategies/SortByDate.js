const ReviewSortingStrategy = require("./ReviewSortingStrategy");

class SortByDate extends ReviewSortingStrategy {
  sort(reviews) {
    return reviews.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
}

module.exports = SortByDate;
