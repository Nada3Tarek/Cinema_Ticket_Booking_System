const express = require('express');
const router = express.Router();
const browseController = require('../controller/browse.controller');

router.get('/', browseController.browseMovies);

router.get('/showtimes', browseController.browseMoviesWithShowtimes);


router.get('/upcoming', browseController.getUpcomingMovies);


router.get('/running', browseController.getCurrentlyRunningMovies);

module.exports = router;

