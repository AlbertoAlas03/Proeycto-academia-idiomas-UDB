require('dotenv').config()
const DataUsers = require('../models/UserSchema')
const jwt = require('jsonwebtoken')

let blacklistedTokens = []; // list of the invalid tokens
const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

        // Check if the token is blacklisted
        if (blacklistedTokens.includes(token)) {
          return res.status(403).json({
            success: false,
            message: 'Token has been invalidated',
          });
        }
    
    jwt.verify(token, process.env.SECRET_KEY , (err, payload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid token',
        });
      } else if(!err && payload) {
        req.user = payload; // Attach the decoded token payload (user info) to the request
        next(); // Continue with the request processing
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token is not provided',
    });
  }
};


const logout = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const { user } = req.body;
  const founduser = await DataUsers.findOne({ user: user });

  if(authHeader) {
      const token = authHeader.split(' ')[1];
      blacklistedTokens.push(token);
      founduser.activity = false; // Set the user's activity to false
      await founduser.save();
      res.json({ message: "User logged out"});
  } else {
      res.status(400).json({ message: "Token is not provided" });
  }
};


module.exports = {
    validateToken,
    logout,
};