
const express = require('express');
const router = express.Router();
const userProfileController = require('../../controllers/userProfileController');
const upload = require('../../middleware/upload');

// Create a user profile
router.post('/user-profile', upload.single('profilePic'), userProfileController.createUserProfile);

// Update a user profile
router.put('/user-profile/:id', upload.single('profilePic'), userProfileController.updateUserProfile);

// Get a user profile by ID
router.get('/user-profile/:id', userProfileController.getUserProfile);

module.exports = router;
