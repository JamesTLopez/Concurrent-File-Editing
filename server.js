var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var path = require('path');
var website = require( path.resolve( __dirname, "./app.js" ) );
var app = express();
var richText = require('rich-text');
const {User,UserSchema,validateUser} = require(`./models/userModel`);
const db = require('sharedb-mongo')('mongodb://localhost:27017/Conc');
const backend = new ShareDB({db});
ShareDB.types.register(richText.type);
var connection = backend.connect();


function createDoc(title) {
    var doc = connection.get('final',title);
    doc.create([{insert: ''}], 'rich-text');
}


function socks(server){
  try{
    var wss = new WebSocket.Server({server: server});
    wss.on('connection', function(ws, req) {
      ws.on('close', function() {

        console.log('Client disconnected');
      });


      var stream = new WebSocketJSONStream(ws);
      console.log('User has connected');
      backend.listen(stream);

    });



  }catch(err){
    console.log('Socket is already open');
    return;
  }

}

module.exports.createDoc = createDoc;
module.exports.startSocket2 = socks;
