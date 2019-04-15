var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
var Quill = require('quill');
var path = require('path');
sharedb.types.register(richText.type);
var title = prompt("Enter room name");

// Open WebSocket connection to ShareDB server
var socket = new WebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// For testing reconnection
window.disconnect = function() {
  connection.close();
};
window.connect = function() {
  var socket = new WebSocket('ws://' + window.location.host);
  connection.bindToSocket(socket);
};

// Create local Doc instance mapped to 'examples' collection document with id 'richtext'
var doc = connection.get('final', title);
doc.subscribe(function(err) {
  if (err) throw err;
  var toolbarOptions = [{'font':[]},
  {'size': ['small', false, 'large', 'huge']},
  'bold', 'italic', {'script': 'sub'}, {'script': 'super'},
  { 'indent': '-1'}, { 'indent': '+1' },
  {'background': []}, {'color': []}, {'align': []},
  'link', 'image', 'video'
  ];
  var quill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });
  quill.setContents(doc.data);

  quill.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    doc.submitOp(delta, {source: quill});
  });
  doc.on('op', function(op, source) {
    if (source === quill) return;
    quill.updateContents(op);


  });
});
