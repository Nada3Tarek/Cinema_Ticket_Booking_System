const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie.controller');
//const { isAdmin } = require('../middlewares/auth.middleware');

// CRUD
router.post('/', 
  //  isAdmin, 
    movieController.createMovie);
router.patch('/:movieId',
    // isAdmin,
      movieController.editMovie);
router.delete('/:movieId', 
   // isAdmin, 
    movieController.removeMovie);
router.patch('/:movieId/status', 
   // isAdmin, 
    movieController.setMovieStatus);

module.exports = router;
