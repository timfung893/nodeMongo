const express = require('express');
const moviesController = require('./../Controllers/moviesController');
const authController = require('./../Controllers/authController')
const router = express.Router();

router.param('id', (req, res, next, value) => {
    console.log('Param is ' + value);
    next();
})

router.route('/')
    .get(authController.isLoggedIn, moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .delete(authController.isLoggedIn, authController.restrict('admin'),moviesController.deleteMovie)

module.exports = router;