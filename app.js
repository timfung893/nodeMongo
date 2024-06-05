const { application } = require('express');
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/movieRoutes')
const authRouter = require('./Routes/authRoutes')
const CustomError = require('./Utils/CustomError')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // add security headers to res
const xss = require('xss-clean'); // clean html code from req body
const sanitize = require('express-mongo-sanitize'); // clean no sql code from req body
const hpp = require('hpp'); // prevent duplicated params
const globalErrorHandler = require('./Controllers/errorController')
let app = express();

let limiter = rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: 'Too many requests. Please try again in 1 hour.'
})

app.use(helmet());
app.use(sanitize());
app.use(xss());
app.use(hpp({
    whitelist: [ // allow below params to be duplicated
        'duration', 'ratings', 'releaseYear', 'genres', 'directors', 'actors', 'price'
    ]
}))
app.use('/api', limiter);
app.use(express.json({limit: '10kb'}));
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})

app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {
    const err = new CustomError(`Cannot find ${req.originalUrl} on the server`, 404);
    next(err);
})

app.use(globalErrorHandler);

module.exports = app;