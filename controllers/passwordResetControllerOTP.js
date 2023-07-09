const User = require('../model/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdonenaziba@gmail.com',
    pass: 'xecnszxoevyeporm',
  },
});

const generateOTP = () => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000);
};

const handlePasswordResetRequest = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists with the provided email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new OTP and set the expiration time
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    console.log(otpExpiration);

    // Save the OTP and expiration time in the user document
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();
    console.log(user);

    // Send the password reset link or notification to the user's email
    const mailOptions = {
      from: 'jdonenaziba@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Hello ${user.name},\n\nYou have requested a password reset. Your OTP is: ${otp}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe App Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request' });
  }
};


const handlePasswordReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find the user associated with the email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided OTP matches and is not expired
    const currentTime = new Date();
    console.log(currentTime);
    if (otp !== user.otp || currentTime > user.otpExpiration) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update the user's password with the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request' });
  }

  
};

module.exports = {
  handlePasswordResetRequest,
  handlePasswordReset,
};
