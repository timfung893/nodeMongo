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

const tokenExpiredErrorHandler= (error) => {
    return new CustomError('Token has expired. Please log in again')
}

const jwtErrorHandler = (error) => {
    return new CustomError('Invalid token. Please log in again')
}

const duplicateKeyErrorHandler = (error) => {
    const name = error.keyValue.name;
    return new CustomError(`Duplicated value: ${name}. Please change your input`)
}
module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devError(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === constants.validationError) error = validationErrorHandler(error);
        if (error.name === constants.tokenExpiredError) error = tokenExpiredErrorHandler(error);
        if (error.name === constants.jwtError) error = jwtErrorHandler(error);
        if (error.code === constants.duplicateKey) error = duplicateKeyErrorHandler(error);
        prodError(res, error);
    }

};