const express = require('express');
const app = express();
const auth = require(`../middleware/authTok`);

const cookieParser = require('cookie-parser')
const cookieSecret ='thelandbeforetime'; //Major security issue- change later
const {  User, UserSchema , validateUser } = require(`../models/userModel`);;
const {  Doc,  validateDoc} = require(`../models/documentModel`);


// Used for redirected web pages 

app.get('/account',auth,async (req,res) => {

    const user = await User.findById(req.user._id);
    res.render('account',
      {name:user.name,
      email:user.email});
});

app.get('/login', async (req,res) => {

    res.render('index');

});

app.get('/register', async (req,res) => {

    res.render('register');

});

app.get('/mainpage', auth, async (req,res) => {
    const user = await User.findById(req.user._id);
    res.render('mainpage2',{
      name:user.name});

});

app.get('/loginconfirmation', auth, async (req,res) => {
    const user = await User.findById(req.user._id);
    res.render('loginconfirmation',{
      name:user.name});

});


app.get('/namedocument', auth, async (req,res) => {
    const user = await User.findById(req.user._id);
    res.render('createDoc',{
      name:user.name});

});


app.get('/textdoc', auth, async (req,res) => {
  res.render(`textdoc`);
});





module.exports = app;
