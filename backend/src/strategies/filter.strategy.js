

class FilterStrategy {
  apply(query, value) {
    throw new Error('apply method must be implemented');
  }
}

class GenreFilterStrategy extends FilterStrategy {
  apply(query, value) {
    if (value && Array.isArray(value)) {
      query.genre = { $in: value };
    } else if (value) {
      query.genre = value;
    }
    return query;
  }
}


class LanguageFilterStrategy extends FilterStrategy {
  apply(query, value) {
    if (value) {
      query.language = value;
    }
    return query;
  }
}


class DateFilterStrategy extends FilterStrategy {
  apply(query, value) {
    if (value) {
      const date = new Date(value);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      query.releaseDate = { $gte: startOfDay, $lte: endOfDay };
    }
    return query;
  }
}


class RatingFilterStrategy extends FilterStrategy {
  apply(query, value) {
    if (value !== undefined && value !== null) {
      query.rating = { $gte: parseFloat(value) };
    }
    return query;
  }
}


class ShowtimeFilterStrategy extends FilterStrategy {
  apply(query, value, showQuery) {
    if (value) {
      const time = new Date(value);
      const startOfDay = new Date(time.setHours(0, 0, 0, 0));
      const endOfDay = new Date(time.setHours(23, 59, 59, 999));
      showQuery.startTime = { $gte: startOfDay, $lte: endOfDay };
    }
    return { movieQuery: query, showQuery };
  }
}

class HallFilterStrategy extends FilterStrategy {
  apply(query, value, showQuery) {
    if (value) {
      showQuery.hallId = value;
    }
    return { movieQuery: query, showQuery };
  }
}


class FilterStrategyFactory {
  static getStrategy(filterType) {
    const strategies = {
      genre: new GenreFilterStrategy(),
      language: new LanguageFilterStrategy(),
      date: new DateFilterStrategy(),
      rating: new RatingFilterStrategy(),
      showtime: new ShowtimeFilterStrategy(),
      hall: new HallFilterStrategy()
    };

    return strategies[filterType] || null;
  }
}

module.exports = {
  FilterStrategy,
  GenreFilterStrategy,
  LanguageFilterStrategy,
  DateFilterStrategy,
  RatingFilterStrategy,
  ShowtimeFilterStrategy,
  HallFilterStrategy,
  FilterStrategyFactory
};


