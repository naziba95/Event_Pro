const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');

// implement function to use nodemailer for sending welcome message
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdonenaziba@gmail.com',
    pass: 'xecnszxoevyeporm',
  },
});

const sendWelcomeEmail = (user) => {
  const mailOptions = {
    from: 'jdonenaziba@gmail.com',
    to: user.email,
    subject: 'Welcome to Our App',
    text: `Dear ${user.name},\n\nWelcome to our app! We're excited to have you on board.\n\nBest regards,\nThe App Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending welcome email:', error);
    } else {
      console.log('Welcome email sent:', info.response);
    }
  });
};


//---------------------------------------------------------------------------------------------
// define function to handle new user registration
const handleNewUser = async (req, res) => {
  const { name, email, pwd } = req.body;

  if (!email || !pwd) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check for duplicate emails in the db
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Generate token
    const token = jwt.sign({ email: email }, process.env.REGISTER_USER_SECRET);

    // Create and store the new user with token
    const result = await User.create({
      name: name,
      email: email,
      password: hashedPwd,
      token: token,
    });

    // Send a welcome email to the user
    sendWelcomeEmail(result);

    // console.log(result);

    res.status(201).json({ success: `New user ${name} created`, token: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
