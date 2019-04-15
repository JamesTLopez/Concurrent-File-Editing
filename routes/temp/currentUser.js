const mongoose = require(`mongoose`);
const express = require(`express`);
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require(`jsonwebtoken`);
const config = require('config');
const app = express.Router();
const {User,validateUser} = require(`../models/userModel`);
const auth = require(`../middleware/authTok`);



app.get('/me', auth, async (req,res) => {

  const user = await User.findById(req.user.id).select('-password');
  res.send(user);

});

module.exports = app;
