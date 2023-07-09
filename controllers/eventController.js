const Event = require('../model/Event');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdonenaziba@gmail.com',
    pass: 'xecnszxoevyeporm',
  },
});

const sendBirthdayWishes = async (event) => {
  try {
    const mailOptions = {
      from: 'jdonenaziba@gmail.com',
      to: event.email,
      subject: 'Happy Birthday!',
      text: `Dear ${event.friendName},\n\n${event.message}\n\nBest regards,\nThe App Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Birthday wishes sent to ${event.email}`);
  } catch (error) {
    console.log(`Error sending birthday wishes to ${event.email}:`, error);
  }
};

const createEvent = async (req, res) => {
  try {
    const { email, friendName, birthday, message } = req.body;

    const parsedBirthday = new Date(birthday); // Parse the birthday string to a Date object

    const event = new Event({
      email,
      friendName,
      birthday: parsedBirthday,
      message,
    });

    const savedEvent = await event.save();

  // Schedule the birthday wishes to be sent on the birthday date in West African Time (WAT)
  const cronJob = cron.schedule(
    `45 10 ${parsedBirthday.getDate()} ${parsedBirthday.getMonth() + 1} *`,
    () => {
      sendBirthdayWishes(savedEvent);
    },
    {
      scheduled: true,
      timezone: 'Africa/Lagos', // Set the time zone to Africa/Lagos
    }
  );

  res.status(201).json(savedEvent);
} catch (error) {
  res.status(500).json({ message: error.message });
}
};


const updateEvent = async (req, res) => {
  try {
    const { email } = req.params;
    const { friendName, birthday, message } = req.body;

    const updatedEvent = await Event.findOneAndUpdate(
      { email },
      { friendName, birthday, message },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { email } = req.params;

    const deletedEvent = await Event.findOneAndDelete({ email });

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { email } = req.params;

    const event = await Event.findOne({ email });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getAllEvents,
};
