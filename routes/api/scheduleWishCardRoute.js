// routes/scheduleWishCard.js
const express = require('express');
const router = express.Router();
const scheduleWishController = require('../../controllers/scheduleWishCardController');
const verifyJWT = require('../../middleware/verifyJWT')

// Create a wish card
router.post('/schedule-wish', verifyJWT, scheduleWishController.createWishCard);

// Update a wish card
router.put('/schedule-wish/:wishCardId', verifyJWT, scheduleWishController.updateWishCard);

// Delete a wish card
router.delete('/schedule-wish/:wishCardId', scheduleWishController.deleteWishCard);

// Get a wish card by ID
router.get('/schedule-wish/:wishCardId', scheduleWishController.getWishCard);

// Get all wish cards
router.get('/schedule-wish/', scheduleWishController.getAllWishCards);

module.exports = router;
