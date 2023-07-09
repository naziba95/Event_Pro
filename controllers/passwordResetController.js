const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdonenaziba@gmail.com',
    pass: 'xecnszxoevyeporm',
  },
});

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists with the provided email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });

    // Save the reset token in the user document
    user.resetToken = resetToken;
    await user.save();

    // Construct the reset URL with the reset token
    const resetURL = `https://your-app-url/reset-password/${resetToken}`;

    // Send the password reset link or notification to the user's email
    const mailOptions = {
      from: 'jdonenaziba@gmail.com',
      to: email,
      subject: 'Password Reset',
      html: `
        <p>Hello ${user.name},</p>
        <p>You have requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>The App Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request' });
  }
};

const handleResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify and decode the reset token
    const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const userId = decodedToken.userId;

    // Find the user associated with the reset token
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password with the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
};

module.exports = {
  handleForgotPassword,
  handleResetPassword,
};
