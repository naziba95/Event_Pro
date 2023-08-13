const ScheduleEvent = require('../model/scheduleEvent');

const createEvent = async (req, res) => {
  try {
    const { eventName, date, time, eventDescription, eventTypes, userId } = req.body;
    // const userId = req.user._id; // Access the user's ID from req.user

    console.log(userId);

    const event = new ScheduleEvent({
      eventName,
      date,
      time,
      eventDescription,
      eventTypes, 
      userId,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.log('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { eventName, date, time, eventDescription } = req.body;
    const userId = req.user._id; // Access the user's ID from req.user

    const updatedEvent = await ScheduleEvent.findOneAndUpdate(
      { _id: eventId, userId },
      { eventName, date, time, eventDescription },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.log('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id; // Access the user's ID from req.user

    const deletedEvent = await ScheduleEvent.findOneAndDelete({
      _id: eventId,
      userId,
    });

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.log('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    const events = await ScheduleEvent.find({ userId });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user events' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const userId = req.user._id; // Access the user's ID from req.user

    const events = await ScheduleEvent.find({ userId });

    res.status(200).json(events);
  } catch (error) {
    console.log('Error retrieving events:', error);
    res.status(500).json({ message: 'Failed to retrieve events' });
  }
};

module.exports = { createEvent, updateEvent, deleteEvent, getUserEvents, getAllEvents };
