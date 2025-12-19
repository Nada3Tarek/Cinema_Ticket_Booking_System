const MovieQueryBuilder = require('../builders/movieQuery.builder');

class BrowseService {
  static async browseMovies(filters = {}) {
    const includeInactive = filters.includeInactive === false || filters.includeInactive === 'false' ? false : true;
    const builder = new MovieQueryBuilder(includeInactive);

    if (filters.search) {
      builder.search(filters.search);
    }

    builder.filters({
      genre: filters.genre,
      language: filters.language,
      date: filters.date,
      rating: filters.rating,
      showtime: filters.showtime,
      hall: filters.hall
    });

    if (filters.sortBy) {
      builder.sort(filters.sortBy, filters.sortOrder || 'desc');
    }

    builder.paginate(filters.page, filters.limit);

    return await builder.build();
  }

  static async browseMoviesWithShowtimes(filters = {}) {
    const includeInactive = filters.includeInactive === false || filters.includeInactive === 'false' ? false : true;
    const builder = new MovieQueryBuilder(includeInactive);

    if (filters.search) {
      builder.search(filters.search);
    }

    builder.filters({
      genre: filters.genre,
      language: filters.language,
      date: filters.date,
      rating: filters.rating,
      showtime: filters.showtime,
      hall: filters.hall
    });

    if (filters.sortBy) {
      builder.sort(filters.sortBy, filters.sortOrder || 'desc');
    }

    builder.paginate(filters.page, filters.limit);

    return await builder.buildWithShows();
  }

  static async getUpcomingMovies(limit = 10, includeInactive = true) {
    const builder = new MovieQueryBuilder(includeInactive);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    builder.movieQuery.releaseDate = { $gte: today };
    builder.sort('releaseDate', 'asc');
    builder.paginate(1, limit);

    return await builder.build();
  }

  static async getCurrentlyRunningMovies(limit = 10, includeInactive = true) {
    const builder = new MovieQueryBuilder(includeInactive);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    builder.movieQuery.releaseDate = { $lte: today };
    builder.sort('releaseDate', 'desc');
    builder.paginate(1, limit);

    return await builder.build();
  }
}

module.exports = BrowseService;

