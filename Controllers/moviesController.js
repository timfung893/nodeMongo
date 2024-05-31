const { param } = require('../Routes/movieRoutes')
const Movie = require('./../Models/moviesModel')
const ApiQuery = require('./../Utils/ApiQuery')

exports.getAllMovies = async (req, res) => {
    try {
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


    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message
        });
    }
}

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message
        });
    }
}

exports.getMovie = async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);
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

}
