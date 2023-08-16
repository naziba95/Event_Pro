const User = require('../model/User')
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


 const handleLogin = async (req, res) => {
  const {email, pwd} = req.body;
  if (!email || !pwd) return res.status(400).json({'message': 'username and password are required'})
  const foundUser = await User.findOne({ email: email}).exec(); 

  // // console.log(foundUser);
  // console.log(foundUser.email);
  // console.log(foundUser.name);
  // console.log(foundUser._id);

  if (!foundUser) return res.sendStatus(401); //unauthorized
// evaluate password
const match = await bcrypt.compare(pwd, foundUser.password);
if (match) { 

  // const roles = Object.values(foundUser.roles);
  // create JWTs
  const accessToken = jwt.sign(
    { 
      UserInfo: {
      userId: foundUser._id,
      email:foundUser.email
        }
    },
    
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d'}
  );
  const refreshToken = jwt.sign(
    { 
      UserInfo: {
      userId: foundUser._id,
      email:foundUser.email
        }
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d'}
  );

  // console.log(accessToken.UserInfo);
// saving refreshToken with current user
  
foundUser.refreshToken = refreshToken;
const result = await foundUser.save();
// console.log(result);

res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });// same site and secure property required only when testing with chrome ie, ( secure: true )
res.json({ accessToken, user: foundUser });
} else {
  res.sendStatus(401);
}

}


module.exports = { handleLogin }