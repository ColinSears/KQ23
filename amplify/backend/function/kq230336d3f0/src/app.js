/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');

var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

ShareDB.types.register(richText.type);
var backend = new ShareDB();


function start(){
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
  var wss = new WebSocket.Server({
    server: server,
    // Set the WebSocket server to use a secure connection
    verifyClient: function (info, cb) {
      // Check if the request is secure
      if (info.secure) {
        cb(true);
      } else {
        cb(false, 400, 'Secure connection required');
      }
    }
  });

  wss.on('connection', function(ws) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  // Serve the editor HTML page
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/editor.html');
  });
}
}

app.listen(3000, function() {
    start();
    console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
