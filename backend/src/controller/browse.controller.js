const BrowseService = require('../services/browse.service');


exports.browseMovies = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      genre: req.query.genre ? (Array.isArray(req.query.genre) ? req.query.genre : [req.query.genre]) : undefined,
      language: req.query.language,
      date: req.query.date,
      rating: req.query.rating,
      showtime: req.query.showtime,
      hall: req.query.hall,
      sortBy: req.query.sortBy || 'releaseDate',
      sortOrder: req.query.sortOrder || 'desc',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await BrowseService.browseMovies(filters);
    res.status(200).json({
      success: true,
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.browseMoviesWithShowtimes = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      genre: req.query.genre ? (Array.isArray(req.query.genre) ? req.query.genre : [req.query.genre]) : undefined,
      language: req.query.language,
      date: req.query.date,
      rating: req.query.rating,
      showtime: req.query.showtime,
      hall: req.query.hall,
      sortBy: req.query.sortBy || 'releaseDate',
      sortOrder: req.query.sortOrder || 'desc',
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    const result = await BrowseService.browseMoviesWithShowtimes(filters);
    res.status(200).json({
      success: true,
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUpcomingMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await BrowseService.getUpcomingMovies(limit);
    res.status(200).json({
      success: true,
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentlyRunningMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await BrowseService.getCurrentlyRunningMovies(limit);
    res.status(200).json({
      success: true,
      data: result.movies,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

