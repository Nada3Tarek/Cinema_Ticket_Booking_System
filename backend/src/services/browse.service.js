const MovieQueryBuilder = require('../builders/movieQuery.builder');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Hall = require('../models/Hall');

class BrowseService {
  // Browse movies (normal, without shows)
  static async browseMovies(filters = {}) {
    const includeInactive =
      filters.includeInactive === false || filters.includeInactive === 'false'
        ? false
        : true;

    const builder = new MovieQueryBuilder(includeInactive);

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

  // Browse movies along with their active shows (movie name & hall populated)
  static async browseMoviesWithShowtimes(filters = {}) {
    const includeInactive =
      filters.includeInactive !== false && filters.includeInactive !== 'false';

    // 1️⃣ Build movie query for filtering
    const movieQuery = {};
    if (filters.search) movieQuery.title = { $regex: filters.search, $options: 'i' };
    if (filters.genre) movieQuery.genre = { $in: filters.genre };
    if (filters.language) movieQuery.language = filters.language;
    if (filters.rating) movieQuery.rating = { $gte: filters.rating };

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 50;

    // 2️⃣ Fetch filtered movies
    const movies = await Movie.find(movieQuery)
      .sort({ releaseDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Movie.countDocuments(movieQuery);

    if (!movies.length) {
      return { movies: [], pagination: { page, limit, total, totalPages: 0 } };
    }

    const movieIds = movies.map(m => m._id);

    // 3️⃣ Build show query with explicit filters
    const showQuery = { movieId: { $in: movieIds } };
    if (!includeInactive) showQuery.isActive = true;
    if (filters.hall) showQuery.hallId = filters.hall;
    if (filters.showtime) {
      const start = new Date(filters.showtime);
      const end = new Date(filters.showtime);
      end.setMinutes(end.getMinutes() + 1); // small range to match exact time
      showQuery.startTime = { $gte: start, $lt: end };
    }

    // 4️⃣ Fetch shows with populated movie title and hall name
    const shows = await Show.find(showQuery)
      .populate({ path: 'movieId', select: 'title' })
      .populate({ path: 'hallId', select: 'name' })
      .lean();

    // 5️⃣ Attach shows to movies
    const movieMap = {};
    movies.forEach(movie => {
      movie.shows = [];
      movieMap[movie._id.toString()] = movie;
    });

    shows.forEach(show => {
      const movieId = show.movieId?._id?.toString();
      if (movieMap[movieId]) {
        movieMap[movieId].shows.push(show);
      }
    });

    return {
      movies: Object.values(movieMap),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  // Get upcoming movies
  static async getUpcomingMovies(limit = 10, includeInactive = true) {
    const builder = new MovieQueryBuilder(includeInactive);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    builder.movieQuery.releaseDate = { $gte: today };
    builder.sort('releaseDate', 'asc');
    builder.paginate(1, limit);

    return await builder.build();
  }

  // Get currently running movies
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
