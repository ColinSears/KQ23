var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
var Quill = require('quill');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// Create local Doc instances mapped to 'KQ' collection document with ids 'richtext1' ...
var doc1 = connection.get('KQ', 'richtext10');

//Event Theme
doc1.subscribe(function(err) {
  if (err) throw err;
  var quill10 = new Quill('#scav');
  quill10.setContents(doc1.data);
  quill10.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill10.getText();
    // get the maximum number of characters allowed
    var maxLength = 50; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill10.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill10.setSelection(maxLength, maxLength);
    }
    doc1.submitOp(delta, {source: quill10});
  });
  doc1.on('op', function(op, source) {
    if (source === quill10) return;
    quill10.updateContents(op);
  });
});
