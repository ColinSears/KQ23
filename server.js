var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');

var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

ShareDB.types.register(richText.type);
var backend = new ShareDB();

createDocs(startServer);

// Create initial document then fire callback
function createDocs(callback) {
  var connection = backend.connect();
  var counter = connection.get('KQ', 'counter');
  var doc1 = connection.get('KQ', 'richtext1');
  var doc2 = connection.get('KQ', 'richtext2');
  var doc3 = connection.get('KQ', 'richtext3');
  var doc4 = connection.get('KQ', 'richtext4');
  var doc5 = connection.get('KQ', 'richtext5');
  var doc6 = connection.get('KQ', 'richtext6');
  var doc7 = connection.get('KQ', 'richtext7');
  var doc8 = connection.get('KQ', 'richtext8');
  var timerDoc = connection.get('KQ', 'timer');
  
  doc1.fetch(function(err) {
    if (err) throw err;
    if (doc1.type === null) {
      doc1.create({ops: []}, 'rich-text', function(err) {
        
          if (err) throw err;
        doc2.create({ops: []}, 'rich-text', function(err) {
          
          if (err) throw err;
          doc3.create({ ops: []}, 'rich-text', function(err) {
            
            if (err) throw err;
            doc4.create({ops: []}, 'rich-text', function(err) {

              if (err) throw err;
              doc5.create({ops: []}, 'rich-text', function(err) {
                
                if (err) throw err;
                doc6.create({ops: []}, 'rich-text', function(err){
                  
                  if (err) throw err;
                  counter.create({numClicks: 0}, function(err){
                    
                    if (err) throw err;
                    doc7.create({ ops: []}, 'rich-text', function(err) {
                      
                      if (err) throw err;
                      doc8.create({ops: []}, 'rich-text', function(err) {
                        
                        if (err) throw err;
                        timerDoc.create({originalTime: 0, remainingTime: 0}, callback);
      
                        // Add event listener to update the timer
                        timerDoc.on('op', function(op, source) {
                          if (source && source !== connection.id) {
                            broadcastTimerUpdate(source);
                          }
                        });
                      });
                    });
                  });
                }); 
              });
            });
          });
        });
      });
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
  app.use(express.static('static'));
  app.use(express.static('node_modules/quill/dist'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  // Serve the editor HTML page
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/dash.html');
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');
}
