const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minLength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password does not match'
        }
    },
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    this.password = bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;