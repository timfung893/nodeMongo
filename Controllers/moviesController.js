const { param } = require('../Routes/movieRoutes')
const Movie = require('./../Models/moviesModel')
const ApiQuery = require('./../Utils/ApiQuery')

exports.getAllMovies = async (req, res) => {
    try {
        let movies = Movie.find();
        const dataQuery = new ApiQuery(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        movies = await dataQuery.data;
        
        // const queryStr = JSON.stringify(req.query);
        // const replacedStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // const queryObj = JSON.parse(replacedStr);
        // let query = Movie.find(queryObj);

        // if (req.query.sort) {
        //     query = query.sort('-price');
        // }
    
        // if (req.query.fields) {
        //     const fieldStr = req.query.fields.split(',').join(' ');
        //     query = await query.select(fieldStr);
        // } else {
        //     query = await query.select('-__v');
        // }

        // const movies = await query;

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
