var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
var Quill = require('quill');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// Create local Doc instances mapped to 'KQ' collection document with ids 'richtext1' ...
var doc1 = connection.get('KQ', 'richtext11');

//Event Theme
doc1.subscribe(function(err) {
  if (err) throw err;
  var quill11 = new Quill('#montage');
  quill11.setContents(doc1.data);
  quill11.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill11.getText();
    // get the maximum number of characters allowed
    var maxLength = 50; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill11.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill11.setSelection(maxLength, maxLength);
    }
    doc1.submitOp(delta, {source: quill11});
  });
  doc1.on('op', function(op, source) {
    if (source === quill11) return;
    quill11.updateContents(op);
  });
});
