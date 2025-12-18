const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie.controller');
const { requireAuth, isAdmin } = require('../middlewares/auth.middleware');

// CRUD
router.post('/', 
    requireAuth, isAdmin, 
    movieController.createMovie);
router.patch('/:movieId',
      requireAuth, isAdmin,
      movieController.editMovie);
router.delete('/:movieId', 
    requireAuth, isAdmin, 
    movieController.removeMovie);
router.patch('/:movieId/status', 
    requireAuth, isAdmin, 
    movieController.setMovieStatus);

module.exports = router;
