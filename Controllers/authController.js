const CustomError = require('../Utils/CustomError');
const User = require('./../Models/userModel')
const ApiQuery = require('./../Utils/ApiQuery')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')

exports.signUp = asyncErrorHandler(async(req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
});