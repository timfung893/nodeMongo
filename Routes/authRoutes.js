const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.route('/sign-up')
    .post(authController.signUp)
router.route('/log-in')
    .post(authController.logIn)
router.route('/forgot-password')
    .post(authController.forgotPassword)
router.route('/reset-password/:token')
    .patch(authController.resetPassword)

module.exports = router;