const express = require('express');
const router = express.Router();

const { handleChangePassword } = require('../../controllers/changePasswordController');

// Route for changing password
router.post('/password/change', handleChangePassword);

module.exports = router;
