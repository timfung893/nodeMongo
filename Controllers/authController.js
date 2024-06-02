const CustomError = require('../Utils/CustomError');
const User = require('./../Models/userModel')
const ApiQuery = require('./../Utils/ApiQuery')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const jwt = require('jsonwebtoken');

exports.signUp = asyncErrorHandler(async(req, res, next) => {
    const user = await User.create(req.body);
    const token = jwt.sign({id: user._id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRED_IN
    });
    
    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user
        }
    })
});