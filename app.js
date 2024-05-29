const { application } = require('express');
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/movieRoutes')

let app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})

app.use('/api/v1/movies', moviesRouter);

module.exports = app;