const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { email } = req.email;

  try {
    // Find the user by their ID
    const user = await User.findById(email).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Update the password with the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
};

module.exports = {
  handleChangePassword
};
