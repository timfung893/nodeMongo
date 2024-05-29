const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    duration: {
        type: String,
        required: [true, 'Duration is required']
    },
    ratings: {
        type: Number,
        default: 1.0
    },
    totalRatings: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required']
    },
    realeaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: new Date().now
    },
    genres: {
        type: [String],
        required: [true, 'Genre is required']
    },    
    directors: {
        type: String,
        required: [true, 'Director is required']
    },
    coverImage: {
        type: [String],
        required: [true, 'Cover image year is required']
    },
    actors: {
        type: [String],
        required: [true, 'Actor is required']
    },   
    price: {
        type: Number,
        required: [true, 'Price is required']
    },

})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;