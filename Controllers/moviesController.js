const CustomError = require('../Utils/CustomError');
const Movie = require('./../Models/moviesModel')
const ApiQuery = require('./../Utils/ApiQuery')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')

exports.getHighestRatedMovies = asyncErrorHandler(async (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratings'
    next();
});

exports.getAllMovies = asyncErrorHandler (async (req, res) => {
    const dataQuery = new ApiQuery(Movie.find(), req.query)
    .sort()
    .filter()
    .limitFields()
    .paginate();

    let movies = await dataQuery.data;

    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: movies
    });
    
})

exports.createMovie = asyncErrorHandler(async (req, res) => {
    const movie = await Movie.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    })
    
})

exports.getMovie = asyncErrorHandler(async(req, res, next) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        if (!movie) {
            const err = new CustomError('Movie is not found', 404);
            return next(err);
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message
        });
    }
});

exports.getMovieByGenres = asyncErrorHandler(async(req, res, next) => {
    const movies = await Movie.aggregate([
        {$unwind: '$genres'},
        {$group: {
            _id: '$genres',
            movieCount: { $sum: 1 },
            movies: { $push: '$name' } 
        }},
        {$addFields: {genre: '$_id'}},
        {$project: {_id: 0}},
        {$sort: {movieCount: -1}}
    ])

    res.status(200).json({
        status: 'success',
        data: {
            movies
        }
    })
});

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        if (!movie) {
            const err = new CustomError('Movie is not found', 404);
            return next(err);
        }
        Movie.deleteOne(id);
        res.status(200).json({
            status: 'success',
            message: 'Movie is deleted successfully'

        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message
        });
    }

});
