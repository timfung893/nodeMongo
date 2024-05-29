const express = require('express');
const moviesController = require('./../Controllers/moviesController');

const router = express.Router();

router.route('/')
    .get(moviesController.getAllMovies);
router.route('/create-movie')
    .post(moviesController.createMovie);

module.exports = router;