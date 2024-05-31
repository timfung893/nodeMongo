const constants = require('../Utils/constants')
const CustomError = require('../Utils/CustomError');

const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
};

const prodError = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again later.',
        })
    }
};

const validationErrorHandler = (error) => {
    if (error.errors) {
        const errorArrMessage = Object.values(error.errors).map(val => val.message).join(',');
        const msg = `Invalid input: ${errorArrMessage}`
        return new CustomError(errorArrMessage, 400);
    }
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devError(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === constants.validationError) error = validationErrorHandler(error);
        prodError(res, error);
    }

};