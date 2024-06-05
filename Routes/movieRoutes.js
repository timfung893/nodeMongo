const express = require('express');
const moviesController = require('./../Controllers/moviesController');
const authController = require('./../Controllers/authController')
const router = express.Router();

router.param('id', (req, res, next, value) => {
    console.log('Param is ' + value);
    next();
})

router.route('/highest-rated')
    .get(moviesController.getHighestRatedMovies, moviesController.getAllMovies)

router.route('/get-by-genres')
    .get(moviesController.getMovieByGenres, moviesController.getAllMovies)

router.route('/')
    .get(authController.isLoggedIn, moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .delete(authController.isLoggedIn, authController.restrict('admin'),moviesController.deleteMovie)

module.exports = router;