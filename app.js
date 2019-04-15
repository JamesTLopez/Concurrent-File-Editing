const express = require(`express`);
const mongoose = require(`mongoose`);
const http = require('http');
const use = require(`./routes/user`);
const {doc,title} = require(`./routes/document`);
const pages = require(`./routes/pages`);
const config = require('config');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var path = require('path');
var ShareDB = require('sharedb');
const auth = require(`./middleware/authTok`);
const cookieParser = require('cookie-parser')
const cookieSecret ='thelandbeforetime'; //Major security issue- change later
const {  User,  validateUser} = require(`./models/userModel`);
const app = express();
const server = http.createServer(app);
const{createDoc,startSocket,startSocket2} = require('./server');
const db = require('sharedb-mongo')('mongodb://localhost:27017/Conc');
const backend = new ShareDB({db});
const port = process.env.PORT || 8080;


// connecting to Mongo Database
mongoose.connect('mongodb://localhost/Conc',{ useNewUrlParser: true })
      .then(()=>console.log(`Connected to mongoDB`))
      .catch(err =>console.error(`Could not connect to MongoDB`));


app.use(express.json());//converts incoming information into json
app.use(express.urlencoded({extended:true})); //converts into url form encoded
app.use(express.static(path.join(__dirname, 'public')));//display static files directly to the site
app.use(express.static('node_modules/quill/dist'));
app.set('view engine','ejs');
app.use(cookieParser(cookieSecret));

// startSocket server for client connections
var wss = new WebSocket.Server({server: server});
wss.on('connection', function(ws, req) {
  ws.on('close', function() {

    console.log('Client disconnected');
  });


  var stream = new WebSocketJSONStream(ws);
  console.log('User has connected');
  backend.listen(stream);

});


//Load specific routes
app.get('/', async (req,res) => {
    res.render('index');
});

app.get('/:id', async (req,res) => {
    res.render('textdoc');
});


//Loading in more specific functional routes
app.use(`/user`,use);
app.use(`/session`,doc);
app.use(`/pages`,pages);




server.listen(port, () => {
        console.log(`Listening on port ${port}....`);
      });

module.exports.websiteapp = app;
module.exports.websiteserver = server;
