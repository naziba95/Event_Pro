const ScheduleWish = require('../model/scheduleWishCard');
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

const createWishCard = async (req, res) => {
  try {

    // const userId = req.user._id;
    // console.log(userId);
    const { userId, wishCard, recipientName, day, month, year, hours, minutes } = req.body;
     // Create a new JavaScript Date object with the specified day, month, and year
    const parsedWishDate = new Date(year, month - 1, day);

    // Set the hours and minutes for the time component
    const parsedWishTime = new Date(parsedWishDate);
    parsedWishTime.setHours(hours);
    parsedWishTime.setMinutes(minutes);
    parsedWishTime.setSeconds(0);
    parsedWishTime.setMilliseconds(0);

    const wish = new ScheduleWish({
      userId,
      wishCard,
      recipientName,
      wishDate: parsedWishDate,
      wishTime: parsedWishTime, // Save the parsed time as a Date object
    });

    const savedWish = await wish.save();

    // Schedule the wishes to be sent on the date and time in West African Time (WAT) inputed by user
    const cronJob = cron.schedule(
      `0 ${minutes} ${hours} ${day} ${month} *`,
      () => {
        sendBirthdayWishes(savedWish);
      },
      {
        scheduled: true,
        timezone: 'Africa/Lagos', // Set the time zone to Africa/Lagos
      }
    );

    res.status(201).json(savedWish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateWishCard = async (req, res) => {
  try {
    const { wishCardId } = req.params;
    const { wishCard, recipientName, day, month, year, hours, minutes } = req.body;

    // Find the existing wish card by ID
    const existingWishCard = await ScheduleWish.findById(wishCardId);

    if (!existingWishCard) {
      return res.status(404).json({ message: 'Wish card not found' });
    }

    // Update the wish card properties
    existingWishCard.wishCard = wishCard;
    existingWishCard.recipientName = recipientName;
    existingWishCard.wishDate = new Date(year, month - 1, day);

    // Set the hours and minutes for the time component
    const parsedWishTime = new Date(existingWishCard.wishDate);
    parsedWishTime.setHours(hours);
    parsedWishTime.setMinutes(minutes);
    parsedWishTime.setSeconds(0);
    parsedWishTime.setMilliseconds(0);
    existingWishCard.wishTime = parsedWishTime;

    // Save the updated wish card
    const updatedWishCard = await existingWishCard.save();

    res.status(200).json(updatedWishCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteWishCard = async (req, res) => {
  try {
    const { wishCardId } = req.params;

    // Find the wish card by ID and remove it
    const deletedWishCard = await ScheduleWish.findByIdAndRemove(wishCardId);

    if (!deletedWishCard) {
      return res.status(404).json({ message: 'Wish card not found' });
    }

    res.status(200).json({ message: 'Wish card deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getWishCard = async (req, res) => {
  try {
    const { wishCardId } = req.params;

    // Find the wish card by ID
    const wishCard = await ScheduleWish.findById(wishCardId);

    if (!wishCard) {
      return res.status(404).json({ message: 'Wish card not found' });
    }

    res.status(200).json(wishCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllWishCards = async (req, res) => {
  try {
    // Retrieve all wish cards
    const wishCards = await ScheduleWish.find();

    res.status(200).json(wishCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createWishCard,
  updateWishCard,
  deleteWishCard,
  getWishCard,
  getAllWishCards,
};
