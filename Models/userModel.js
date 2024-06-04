const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
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
        minLength: 8,
        select: false // prevent returning this password value in api
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password and confirm password does not match'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    passwordChangedDate: Date,
    passwordResetToken: String,
    passwordResetTokenExpiredIn: Date,
    active: {
        type: Boolean,
        select: false,
        default: true
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
})

// any query starting with 'find' will return active users
userSchema.pre(/^find/, function(next) {
    this.find({active: true});
    next();
});

userSchema.methods.comparePassword = async function(pwd, pwdDB) {
    return bcrypt.compare(pwd, pwdDB);
}

userSchema.methods.isPasswordChanged = async function(iat) {
    if (iat && this.passwordChangedDate) {
        const passwordChangedTime = parseInt(this.passwordChangedDate.getTime() / 1000, 10);
        return iat < passwordChangedTime;
    }
    return false;
}
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiredIn = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema); 

module.exports = User;