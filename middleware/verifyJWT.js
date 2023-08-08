const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }

    // console.log(decoded);

    req.user = {
      userId: decoded.UserInfo._id,
      email: decoded.UserInfo.email,
    };

    // console.log(req.user);
    next();
  });
};

module.exports = verifyJWT;
