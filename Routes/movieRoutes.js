const express = require('express');
const moviesController = require('./../Controllers/moviesController');

const router = express.Router();

router.param('id', (req, res, next, value) => {
    console.log('Param is ' + value);
    next();
})

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)

module.exports = router;