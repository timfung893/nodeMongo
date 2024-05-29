const Movie = require('./../Models/moviesModel')

exports.getAllMovies = async (req, res, ) => {
    try {
        // const movies = await Movie.find();

        const queryStr = JSON.stringify(req.query);
        const replacedStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(replacedStr);
        movies = await Movie.find(queryObj);
    
        
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

exports.createMovie = async (req, res, ) => {
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