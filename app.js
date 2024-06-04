const { application } = require('express');
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/movieRoutes')
const authRouter = require('./Routes/authRoutes')
const CustomError = require('./Utils/CustomError')
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./Controllers/errorController')
let app = express();

let limiter = rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: 'Too many requests. Please try again in 1 hour.'
})
app.use('/api', limiter);
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})
app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {
    // res.json({
    //     status: 'failed',
    //     message: `Cannot find ${req.originalUrl} on the server`
    // })
    const err = new CustomError(`Cannot find ${req.originalUrl} on the server`, 404);
    next(err);
})

app.use(globalErrorHandler);

module.exports = app;