const CustomError = require('../Utils/CustomError');
const User = require('./../Models/userModel')
const ApiQuery = require('./../Utils/ApiQuery')
const asyncErrorHandler = require('../Utils/asyncErrorHandler')
const util = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../Utils/email');
const crypto = require('crypto');

exports.getAllUsers = asyncErrorHandler(async(req, res, next) => {
    const allUsers = await User.find();
    res.status(200).json({
        status: 'success',
        data: {
            users: allUsers
        }
    })
})

exports.signToken = id => {
    const token = jwt.sign({id: id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRED_IN
    });
    return token
}

exports.signUp = asyncErrorHandler(async(req, res, next) => {
    const user = await User.create(req.body);
    const token = this.signToken(user._id);
    
    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user
        }
    })
});

exports.logIn = asyncErrorHandler(async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        const err = new CustomError('Please input email and password', 400);
        return next(err);
    }

    const user = await User.findOne({ email }).select('+password');
    if (user) {
        const isPasswordMatch = await user.comparePassword(password, user.password);
        if (!isPasswordMatch) {
            const err = new CustomError('Incorrect email or password', 400);
            return next(err);
        }
    } else {
        const err = new CustomError('This user is not registered', 400);
        return next(err);
    }


    const token = this.signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
        expiredIn: process.env.EXPIRED_IN,
        message: 'Logged in successfully'

    })
});

exports.isLoggedIn = asyncErrorHandler(async(req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken && authToken.startsWith('Bearer')) {
        const token = authToken.split(' ')[1];
        if (token) {
            const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
            const user = await User.findById(decodedToken.id);
            if (user) {
                const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
                if (isPasswordChanged) {
                    const err = new CustomError('Your password has changed. Please log in again', 401);
                    return next(err);
                }
                req.user = user;
            } else {
                const err = new CustomError('The user with the given token does not exist', 401);
                return next(err);
            }

        } else {
            const  err = new CustomError('You are not authenticated. Please log in first');
            return next(err);
        }
    }
    next();
});

exports.restrict = function(role) {
    return (req, res, next) => {
        if (req.user.role && req.user.role !== role) {
            const err = new CustomError('You do not have permission to perform this action', 401);
            return next(err);
        } else {
            const err = new CustomError('You are not logged in', 400);
            return next(err);
        }
        next();
    };
}

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    if (req.body.email) {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const resetToken = user.createPasswordResetToken();
            await user.save({validateBeforeSave: false})
            // send email
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
            const message = `We have received a password reset request. Please click the below link to reset your password \n\n${resetUrl}\n\nThis reset password link will be valid for 10 minutes.`;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Password Reset Link',
                    message: message
                });
                res.status(200).json({
                    status: 'success',
                    message: 'Password reset link has been sent to your email'
                })
            } catch (error) {
                user.passwordResetToken = undefined;
                user.passwordResetTokenExpiredIn = undefined;
                await user.save({validateBeforeSave: false});
                const err = new CustomError('There was an error sending password reset email. Please try again later', 500);
                return next(err);
            }

        } else {
            const err = new CustomError('Email does not exist', 400);
            return next(err);
        }
    }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    if (!req.body.password || !req.body.confirmPassword) {
        const err = new CustomError('Please input all fields to continue');
        return next(err);
    }
    if (req.params.token) {
        const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpiredIn: {$gt: Date.now()} });
        if (user) {
            user.password = req.body.password;
            user.confirmPassword = req.body.confirmPassword;
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpiredIn = undefined;
            user.passwordChangedDate = Date.now();
            console.log(user._id);
            
            await user.save();

            const loginToken = this.signToken(user._id);
            res.status(200).json({
                status: 'success',
                token: loginToken,
                message: 'Reset password successfully'
            })
        } else {
            const err = new CustomError('Token is invalid or expired');
            return next(err);
        }
    }
});

exports.updatePassword = asyncErrorHandler(async(req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');

    if (user && user.password) {
        const isPasswordMatch = await user.comparePassword(req.body.oldPassword, user.password);
        if (isPasswordMatch) {
            user.password = req.body.password;
            user.confirmPassword = req.body.confirmPassword;
            await user.save();
            const token = this.signToken(user._id)
            res.status(200).json({
                status: 'success',
                token,
                message: 'Password changed successfully'
            })
        } else {
            const err = new CustomError('Password does not match');
            return next(err);
        }
    }
})

const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
    })
    return newObj;
};

exports.updateUserDetail = asyncErrorHandler(async(req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        const err = new CustomError('You cannot change password with this action');
        return next(err);
    }

    const filterObj = filterReqObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, {runValidators: true, new: true});

    res.status(200).json({
        status: 'success',
        message: 'Updated user information successfully'
    })

})

exports.deleteUser = asyncErrorHandler(async(req, res, next) => {
    const deleteUser = await User.findByIdAndUpdate(req.user._id, {active: false});

    res.status(204).json({
        status: 'success',
        message: 'Delete account successfullyd'
    })
})