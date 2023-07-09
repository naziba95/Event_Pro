const express = require('express');
const router = express.Router();

const {handlePasswordResetRequest, handlePasswordReset  } = require('../../controllers/passwordResetControllerOTP');
// const { handleChangePassword } = require('../../controllers/changePasswordController');

// Route for initiating the password reset request
router.post('/forgotpassword', handlePasswordResetRequest );

// Route for resetting the password
router.post('/resetpassword', handlePasswordReset);

module.exports = router;
