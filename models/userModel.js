const mongoose = require(`mongoose`);
const Joi = require(`joi`);
const config = require('config');
const jwt = require('jsonwebtoken');
const {  Doc, DocSchema , validateDoc } = require(`../models/documentModel`);


//Created for Users
//Required for login purposes

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    maxlength:15,
    minlength:2
  },
  email:{
    type:String,
    required:false
  },
  password:{
    type:String,
    required:true,
    minlength:5
  },
  documents:[String]
});

//genereates the authentication token
userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this.id},'1234');
  return token;
}

const UserSchema = mongoose.model('User',userSchema);


//Error check function
function validatedEntry(body){
  const schem = {
    name: Joi.string().min(3).required(),
    email: Joi.string().min(4).required(),
    password: Joi.string().min(5).required()
  };

  return result = Joi.validate(body,schem);

};

module.exports.User = UserSchema;
module.exports.userSchema = userSchema;
module.exports.validateUser = validatedEntry;
