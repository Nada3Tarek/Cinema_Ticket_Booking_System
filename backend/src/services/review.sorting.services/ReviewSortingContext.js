const SortByRating = require("./strategies/SortByRating");
const SortByDate = require("./strategies/SortByDate");
const SortByPopularity = require("./strategies/SortByPopularity");

class ReviewSortingContext {
  constructor(method) {
    if (method === "rating") {
      this.strategy = new SortByRating();
    } else if (method === "popularity") {
      this.strategy = new SortByPopularity();
    } else {
      // default
      this.strategy = new SortByDate();
    }
  }

  sort(reviews) {
    return this.strategy.sort(reviews);
  }
}

module.exports = ReviewSortingContext;
