const mongoose = require(`mongoose`);
const express = require(`express`);
const path = require('path');
const jwt = require(`jsonwebtoken`);
const config = require('config');
const app = express.Router();
const {
  User,
  validateUser
} = require(`../models/userModel`);
const auth = require(`../middleware/authTok`);
const Joi = require(`joi`);
const cookieParser = require('cookie-parser')
const cookieSecret = 'thelandbeforetime';

app.use(cookieParser(cookieSecret));



// AUTHENICATION OF TOKENS
app.get('/me', auth, async (req, res) => {

  const user = await User.findById(req.user._id);
  res.send(user);
});

//Logout
//Clear cookie after logout
app.get('/logout', auth, async (req, res) => {

  res.clearCookie('auth');
  res.render('logoutsuccess');
});

//LOGIN OF USER
//creates a token for the currently logged in user
app.post(`/login`, async (req, res) => {

  const {error} = validatedemail(req.body);
  if (error) {
    res.render('loginconfirmation',{
      error:error.details[0].message
    });
  }


  let user = await User.findOne({
    email: req.body.email
  });

  if (user == null) {
    res.render('loginconfirmation',{
      error:'Please enter a valid email or password'
    });
  };

  if (req.body.password != user.password) {
    res.render('loginconfirmation',{
      error:'Please enter a valid email or password'
    });
  }
  else{

  const token = user.generateAuthToken();
  const options = {
      headers: {
        'x-auth-token': token,
        'x-sent': true
      }
  }

    res.cookie('auth', token, options);
    res.redirect('/pages/mainpage');
  }

});

function validatedemail(body) {
  const schem = {
    email: Joi.string().min(4).required(),
    password: Joi.string().min(5).required()
  };

  return result = Joi.validate(body, schem);

};



//REGISTER NEW USER
app.post(`/register`, async (req, res) => {

  const {
    error
  } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  await user.save();
  const token = user.generateAuthToken();

  const options = {
    headers: {
      'x-auth-token': token,
      'x-sent': true
    }
  }

  res.cookie('auth', token, options);
  res.redirect('/pages/mainpage');

})


module.exports = app;
