const ScheduleWish = require('../model/scheduleWishCard');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const multer = require('multer');
const upload = require('../middleware/upload');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdonenaziba@gmail.com',
    pass: 'xecnszxoevyeporm',
  },
});

const sendWishCard = async (wish) => {
  try {
    const mailOptions = {
      from: 'jdonenaziba@gmail.com',
      to: wish.recipientEmail,
      subject: 'You have a wish card',
      text: `Dear ${wish.recipientName},\n\nBest wishes from EventPro`,
      attachments: [
        {
          path: wish.wishCard,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Wish card sent to email:', info.response);
  } catch (error) {
    console.log('Error sending wish card:', error);
  }
};

const createWishCard = async (req, res) => {
  try {
    const { recipientName, wishDate, wishTime, recipientEmail, userId } = req.body;
    const imagePath = req.file ? req.file.path : null;
    
    console.log(wishTime);
    console.log(recipientName);
    console.log(imagePath);

    const parsedWishDate = new Date(wishDate);
    let parsedWishTime = null;
    
    if (wishTime) {
      const [hours, minutes] = wishTime.split(':');
      parsedWishTime = new Date(parsedWishDate);
      parsedWishTime.setHours(hours);
      parsedWishTime.setMinutes(minutes);
    }

    console.log(parsedWishTime);


    // if (isNaN(parsedWishDate) || (wishTime && isNaN(parsedWishTime))) {
    //   return res.status(400).json({ message: 'Invalid wish date or time format' });
    // }

    const wish = await ScheduleWish.create ({
      wishCard: imagePath,
      recipientName,
      wishDate: parsedWishDate,
      wishTime: parsedWishTime,  
      recipientEmail,
      userId,
    });

    // const savedWish = await wish.save();

    // Schedule the wishes to be sent on the date and time in West African Time (WAT) input by the user
    if (parsedWishTime) {
      const cronJob = cron.schedule(
        `${parsedWishTime.getMinutes()} ${parsedWishTime.getHours()} ${parsedWishDate.getDate()} ${parsedWishDate.getMonth() + 1} *`,
        () => {
          sendWishCard(savedWish);
        },
        {
          scheduled: true,
          timezone: 'Africa/Lagos',
        }
      );
      
    }

    res.status(201).json(wish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWishCard = async (req, res) => {
  try {
    const { wishCardId } = req.params;
    const { wishCard, recipientName, recipientEmail, wishDate, wishTime } = req.body;

    const existingWishCard = await ScheduleWish.findById(wishCardId);

    if (!existingWishCard) {
      return res.status(404).json({ message: 'Wish card not found' });
    }

    existingWishCard.wishCard = wishCard;
    existingWishCard.recipientName = recipientName;
    existingWishCard.recipientEmail = recipientEmail;

    const parsedWishDate = new Date(wishDate);
    let parsedWishTime = null;

    if (wishTime) {
      const [hours, minutes] = wishTime.split(':');
      parsedWishTime = new Date(parsedWishDate);
      parsedWishTime.setHours(hours);
      parsedWishTime.setMinutes(minutes);
    }

    if (isNaN(parsedWishDate) || (wishTime && isNaN(parsedWishTime))) {
      return res.status(400).json({ message: 'Invalid wish date or time format' });
    }

    existingWishCard.wishDate = parsedWishDate;
    existingWishCard.wishTime = parsedWishTime;

    if (req.file) {
      existingWishCard.wishCard = req.file.path;
    }

    const updatedWishCard = await existingWishCard.save();

    res.status(200).json(updatedWishCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteWishCard = async (req, res) => {
  try {
    const { wishCardId } = req.params;
    const deletedWishCard = await ScheduleWish.findByIdAndRemove(wishCardId);

    if (!deletedWishCard) {
      return res.status(404).json({ message: 'Wish card not found' });
    }

    if (deletedWishCard.wishCard) {
      // Delete the image file using fs.unlink or your preferred method
    }

    res.status(200).json({ message: 'Wish card deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishCard = async (req, res) => {
  try {
    const { wishCardId } = req.params;
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
    const wishCards = await ScheduleWish.find();
    res.status(200).json(wishCards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllWishCardsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishCards = await ScheduleWish.find({ userId : userId });

    if (!wishCards || wishCards.length === 0) {
      return res.status(404).json({ message: 'No wish cards found for the specified user' });
    }

    res.status(200).json(wishCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWishCard,
  updateWishCard,
  deleteWishCard,
  getWishCard,
  getAllWishCards,
  getAllWishCardsByUserId
};
