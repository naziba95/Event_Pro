// routes/scheduleWishCard.js
const express = require('express');
const router = express.Router();
const scheduleWishController = require('../../controllers/scheduleWishCardController');
// const verifyJWT = require('../../middleware/verifyJWT')
const upload = require('../../middleware/upload');

// Create a wish card
router.post('/schedule-wish', upload.single('wishCard'), scheduleWishController.createWishCard);

// Update a wish card
router.put('/schedule-wish/:wishCardId', upload.single('wishCard'), scheduleWishController.updateWishCard);

// Delete a wish card
router.delete('/schedule-wish/:wishCardId', scheduleWishController.deleteWishCard);

// Get a wish card by ID
router.get('/schedule-wish/:wishCardId', scheduleWishController.getWishCard);

// Get all wish cards
router.get('/schedule-wish/', scheduleWishController.getAllWishCards);

// Get all wish cards for a particular customer by userId
router.get('/schedule-wish/user/:userId', scheduleWishController.getAllWishCardsByUserId);

module.exports = router;
