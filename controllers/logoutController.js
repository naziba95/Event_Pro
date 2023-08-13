const User = require('../model/User');

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(400).json({ message: 'User not logged in' });
  }

  const refreshToken = cookies.jwt;

  try {
    // Find user by refreshToken in the database
    const foundUser = await User.findOne({ refreshToken }).exec();
    
    if (!foundUser) {
      // Clear cookies and return success response
      res.clearCookie('jwt', { httpOnly: true, maxAge: 0 });
      return res.status(200).json({ message: 'Logout successful' });
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    await foundUser.save();

    // Clear cookies and return success response
    res.clearCookie('jwt', { httpOnly: true, maxAge: 0, sameSite: 'None', secure: true });
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { handleLogout };
