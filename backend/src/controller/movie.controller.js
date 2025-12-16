const MovieService = require('../services/movie.service');


// Add new movie
exports.createMovie = async (req, res) => {
  try {
    const movie = await MovieService.createMovie(req.body);
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit movie
exports.editMovie = async (req, res) => {
  try {
    const movie = await MovieService.editMovie(req.params.movieId, req.body);
    res.status(200).json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Soft delete / deactivate movie
exports.removeMovie = async (req, res) => {
  try {
    const movie = await MovieService.removeMovie(req.params.movieId);
    res.status(200).json({ message: 'Movie removed (soft delete)', movie });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.setMovieStatus = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { isActive } = req.body;

    const movie = await MovieService.setActiveStatus(movieId, isActive);
    res.status(200).json({
      message: `Movie ${isActive ? 'activated' : 'deactivated'} successfully`,
      movie
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
