require('dotenv').config();
const express = require('express');
const { send } = require('express/lib/response');
const app = express();
const path = require("path");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger, logEvents } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbCon');
const PORT = process.env.PORT || 3000;
const eventRoutes = require('./routes/api/eventRoutes');
const bodyParser = require('body-parser');
const passwordResetRoutes = require('./routes/api/passwordResetRoutes');
const changePasswordRoute = require('./routes/api/changePasswordRoute');

const passwordResetRouteOTP = require('./routes/api/passwordResetRouteOTP');
// const scheduleEventRoutes = require('./routes/api/scheduleEventRoute');

const scheduleEventRoute = require('./routes/api/scheduleEventRoute');
const verifyToken = require('./middleware/verifyToken');






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger); 

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in midleware to handle urlencoded data in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
 app.use(express.urlencoded({ extended: false })); 

 // built-in middleware for json
 app.use(express.json());

 //middleware for ccokies
// const cookieParser = require('cookie-parser');
app.use(cookieParser());

 // serve static files
 app.use(express.static(path.join(__dirname, '/public')));

 app.use('/api', scheduleEventRoute);

// Sign on and register route should be accessible before token generation
 app.use('/auth', require('./routes/auth'));
 app.use('/register', require('./routes/register'));

// protect routes using JWT authentication
 app.use(verifyJWT);

// routes
app.use('/', require('./routes/root'));   // endpoint and route handler 
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));  
// Use event routes
app.use('/api', eventRoutes);
// Password Reset Routes
app.use('/api', passwordResetRoutes);
// app.use('/api', scheduleEventRoutes);
// Password Reset Routes OTP
app.use('/api', passwordResetRouteOTP);

// Change Password Routes
app.use('/api', changePasswordRoute);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: "404 not found"});
  } else {
    res.type('txt').send("404 not found")
  }  
});

// custom error handling in express
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT} `);
  });
  
})



  