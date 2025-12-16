const Movie = require('../models/Movie');

class MovieService {
    static async createMovie(data) {
    const movie = await Movie.create(data);
    return movie;
  }

  static async editMovie(movieId, data) {
    const movie = await Movie.findByIdAndUpdate(movieId, data, { new: true });
    if (!movie) throw new Error('Movie not found');
    return movie;
  }

  static async removeMovie(movieId) {
    const movie = await Movie.findById(movieId);
    if (!movie) throw new Error('Movie not found');
    movie.isActive = false; // soft delete
    await movie.save();
    return movie;
  }
  static async setActiveStatus(movieId, isActive) {
    const movie = await Movie.findById(movieId);
    if (!movie) throw new Error('Movie not found');

    movie.isActive = isActive;
    await movie.save();

    return movie;
  }
}

module.exports = MovieService;
