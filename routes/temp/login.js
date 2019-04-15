const mongoose = require(`mongoose`);
const express = require(`express`);
const bcrypt = require('bcrypt');
const path = require('path');
const app = express.Router();
const {User} = require(`../models/userModel`);
const Joi = require(`joi`);


app.post(`/`,async (req,res)=>{
  const {error} = validateUser(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email:req.body.email});
  console.log(user);
  if(user == null) return res.status(400).send('Invalid email or password');


  const validpass = await bcrypt.compare(req.body.password, user.password);

  if(!validpass){
    return res.status(400).send('Invalid email or password');
  }else{
    console.log("login Success")

    const token = user.generateAuthToken();


    res.header('x-auth-token',token);
    res.redirect('/user');
    console.log(token);
  }

})

function validateUser(req){
  const schem = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  };

  return result = Joi.validate(req,schem);
}

module.exports = app;
