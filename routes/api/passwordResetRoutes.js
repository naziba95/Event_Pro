const express = require('express');
const router = express.Router();

const {handleForgotPassword, handleResetPassword  } = require('../../controllers/passwordResetController');
// const { handleChangePassword } = require('../../controllers/changePasswordController');

// Route for initiating the password reset request
router.post('/forgot-password', handleForgotPassword );

// Route for resetting the password
router.post('/reset-password', handleResetPassword);

module.exports = router;
