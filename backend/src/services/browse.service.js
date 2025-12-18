const MovieQueryBuilder = require('../builders/movieQuery.builder');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Hall = require('../models/Hall');

class BrowseService {

  // Browse movies (normal, without shows)
  static async browseMovies(filters = {}) {
    const builder = new MovieQueryBuilder();

    if (filters.search) builder.search(filters.search);

    builder.filters({
      genre: filters.genre,
      language: filters.language,
      date: filters.date,
      rating: filters.rating,
      showtime: filters.showtime,
      hall: filters.hall
    });

    if (filters.sortBy) builder.sort(filters.sortBy, filters.sortOrder || 'desc');

    builder.paginate(filters.page, filters.limit);

    return await builder.build();
  }

  // Browse movies along with their active shows
  static async browseMoviesWithShowtimes(filters = {}) {
    // 1️⃣ Get movies directly from MongoDB
    const query = {};
    if (filters.search) query.title = { $regex: filters.search, $options: 'i' };
    if (filters.genre) query.genre = { $in: filters.genre };
    if (filters.language) query.language = filters.language;
    if (filters.rating) query.rating = { $gte: filters.rating };

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;

    const movies = await Movie.find(query)
      .sort({ releaseDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Movie.countDocuments(query);

    if (!movies.length) return { movies: [], pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };

    const movieIds = movies.map(m => m._id);

    // 2️⃣ Get active shows for these movies and populate movie title and hall name
    const shows = await Show.find({ movieId: { $in: movieIds }, isActive: true })
      .populate({ path: 'movieId', select: 'title' })
      .populate({ path: 'hallId', select: 'name' })
      .lean();

    // 3️⃣ Attach shows to each movie
    const movieMap = {};
    movies.forEach(movie => {
      movie.shows = [];
      movieMap[movie._id.toString()] = movie;
    });

    shows.forEach(show => {
      const movieId = show.movieId?._id.toString();
      if (movieMap[movieId]) movieMap[movieId].shows.push(show);
    });

    return {
      movies: Object.values(movieMap),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  // Get upcoming movies
  static async getUpcomingMovies(limit = 10) {
    const builder = new MovieQueryBuilder();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    builder.movieQuery.releaseDate = { $gte: today };
    builder.sort('releaseDate', 'asc');
    builder.paginate(1, limit);

    return await builder.build();
  }

  // Get currently running movies
  static async getCurrentlyRunningMovies(limit = 10) {
    const builder = new MovieQueryBuilder();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    builder.movieQuery.releaseDate = { $lte: today };
    builder.sort('releaseDate', 'desc');
    builder.paginate(1, limit);

    return await builder.build();
  }
}

module.exports = BrowseService;
