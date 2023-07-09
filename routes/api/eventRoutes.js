const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');

// Create a new event
router.post('/events', eventController.createEvent);

// Update an existing event
router.put('/events/:email', eventController.updateEvent);

// Delete an event
router.delete('/events/:email', eventController.deleteEvent);

// Get a specific event
router.get('/events/:email', eventController.getEvent);

// Get all events
router.get('/events', eventController.getAllEvents);

module.exports = router;

