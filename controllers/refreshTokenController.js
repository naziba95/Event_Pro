const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  // Check if the JWT cookie exists
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    // Find the user based on the refreshToken
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      return res.sendStatus(403); // Forbidden
    }

    // Verify the refreshToken against the secret
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.username !== decoded.UserInfo.username) {
        return res.sendStatus(403); // Forbidden
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.UserInfo.username,
            email: foundUser.email,
            // Include other user data if needed
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ accessToken });
    });
  } catch (error) {
    res.sendStatus(500); // Internal Server Error
  }
};

module.exports = { handleRefreshToken };
