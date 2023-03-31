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
  var docs = [    connection.get('KQ', 'richtext1'),    connection.get('KQ', 'richtext2'),    connection.get('KQ', 'richtext3'),    connection.get('KQ', 'richtext4'),    connection.get('KQ', 'richtext5'),    connection.get('KQ', 'richtext6'),    connection.get('KQ', 'richtext7'),    connection.get('KQ', 'richtext8')  ];
  var timerDocs = [    connection.get('KQ', 'timer1'),    connection.get('KQ', 'timer2'),    connection.get('KQ', 'timer3'),    connection.get('KQ', 'timer4'),    connection.get('KQ', 'timer5')  ];
  
  const createDoc = (doc, type) => {
    return new Promise((resolve, reject) => {
      doc.create({ ops: [] }, type, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };
  
  const createCounter = (counter) => {
    return new Promise((resolve, reject) => {
      counter.create({ numClicks: 0 }, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };
  
  const createTimerDoc = (timerDoc) => {
    return new Promise((resolve, reject) => {
      timerDoc.create({ originalTime: 0, remainingTime: 0 }, (err) => {
        if (err) {
          reject(err);
        } else {
          // Add event listener to update the timer
          timerDoc.on('op', (op, source) => {
            if (source && source !== connection.id) {
              broadcastTimerUpdate(source);
            }
          });
  
          resolve();
        }
      });
    });
  };
  
  docs[0].fetch(function(err) {
    if (err) throw err;
  
    if (docs[0].type === null) {
      Promise.all([
        createDoc(docs[0], 'rich-text'),
        createDoc(docs[1], 'rich-text'),
        createDoc(docs[2], 'rich-text'),
        createDoc(docs[3], 'rich-text'),
        createDoc(docs[4], 'rich-text'),
        createDoc(docs[5], 'rich-text'),
        createDoc(docs[6], 'rich-text'),
        createDoc(docs[7], 'rich-text'),
        createCounter(counter),
        createTimerDoc(timerDocs[0]),
        createTimerDoc(timerDocs[1]),
        createTimerDoc(timerDocs[2]),
        createTimerDoc(timerDocs[3]),
        createTimerDoc(timerDocs[4])
      ])
        .then(() => {
          callback();
        })
        .catch((err) => {
          throw err;
        });
    } else {
      callback();
    }
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

  server.listen(3000);
  console.log('Listening on Port 3000');
}
