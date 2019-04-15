const mongoose = require(`mongoose`);
const Joi = require(`joi`);
const config = require('config');
const jwt = require('jsonwebtoken');
const {  User, userSchema , validateUser } = require(`../models/userModel`);




const docSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
    maxlength:15,
    minlength:2
  },
  text:{
    type:String,
    required:false
  },
  permissions:{
    type:Boolean,
    required:false,

  },
  users:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:`userSchema`
  }],
  isOpen:Boolean

});

//genereates the authentication token
docSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this.id},config.get('jwt'));
  return token;
}

const DocSchema = mongoose.model('Doc',docSchema);


//Error check function
function validatedEntry(body){
  const schem = {
    title: Joi.string().min(1).required(),
    text: Joi.string()
  };

  return result = Joi.validate(body,schem);

};

module.exports.Doc = DocSchema;
module.exports.docSchema = docSchema;
module.exports.validateDoc = validatedEntry;
