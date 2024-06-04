const express = require('express');
const authController = require('../Controllers/authController');

const router = express.Router();

router.route('/all-users')
    .get(authController.getAllUsers)
router.route('/sign-up')
    .post(authController.signUp)
router.route('/log-in')
    .post(authController.logIn)
router.route('/forgot-password')
    .post(authController.forgotPassword)
router.route('/reset-password/:token')
    .patch(authController.resetPassword)
router.route('/update-password')
    .patch(authController.isLoggedIn, authController.updatePassword)
router.route('/update-userDetail')
    .patch(authController.isLoggedIn, authController.updateUserDetail)
router.route('/delete-user')
    .patch(authController.isLoggedIn, authController.deleteUser)

module.exports = router;