const express = require('express');
const router = express.Router();
const verifyJWT = require('../../middleware/verifyJWT');
const scheduleEventController = require('../../controllers/scheduleEventController');

// Create an event
router.post('/schedule-events', verifyJWT, scheduleEventController.createEvent);

// Update an event
router.put('/schedule-events/:eventId', verifyJWT, scheduleEventController.updateEvent);

// Delete an event
router.delete('/schedule-events/:eventId', verifyJWT, scheduleEventController.deleteEvent);

// Route for getting user events
router.get('/schedule-events/:userId', scheduleEventController.getUserEvents);

// Get all events
router.get('/schedule-events', verifyJWT, scheduleEventController.getAllEvents);

module.exports = router;
