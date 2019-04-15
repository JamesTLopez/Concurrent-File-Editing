const express = require('express');
const {User,UserSchema,validateUser} = require(`../models/userModel`);
const auth = require(`../middleware/authTok`);
const cookieParser = require('cookie-parser')
const cookieSecret = 'thelandbeforetime'; //Major security issue- change later
const app = express();

const{createDoc,startSocket} = require('../server');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');


// create document
app.post(`/create`, auth, async (req, res) => {

  const user = await User.findById(req.user._id);

  //Error Check
  const users = User.find({_id:req.user._id,documents:req.body.title},(err,docs) =>{
        if (!docs.length){
            console.log('Document has been logged');
            user.documents.push(req.body.title);
            user.save();
            createDoc(req.body.title);
            res.redirect('/'+req.body.title);
        }else{

            res.send(`Document already exists`);

        }
  });

});

//ADD USER
//Enter users name then add the document to their library
app.post(`/adduser`, auth, async (req, res) => {

  const user = await User.findOne({name:req.body.name},(err,name) =>{
    if(name == null){
      res.send('User does not exist');
    }
  });
  user.documents.push(req.body.current);
  user.save();

  console.log('hello: ' + req.body.name);
  res.redirect(`/`+ req.body.current);
})


//REDIRECTS TO THE DOCUMENT
app.post('/opendoc',auth,async(req,res) =>{

  res.redirect(`/`+req.body.title);
});




// DISPLAYS ALL THE TITLES OF THE DOCUMENT
// all documents will be displayed on this page
app.get('/display', auth, async (req, res) => {

  const user = await User.findById(req.user._id)
    .select('documents -_id');

  const users = await User.findById(req.user._id);


  var ds = user.documents;
  var info=[];
  var i;

  //Push into new array
  for (i = 0; i < ds.length; i++) {
    info.push({title:ds[i]});
  }


  res.render('saveddocs',{
    titles:info,
    name:users.name
  });

})


module.exports.doc = app;
