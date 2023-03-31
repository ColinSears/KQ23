var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
var Quill = require('quill');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// Create local Doc instances mapped to 'KQ' collection document with ids 'richtext1' ...
var doc1 = connection.get('KQ', 'richtext1');
var doc2 = connection.get('KQ', 'richtext2');
var doc3 = connection.get('KQ', 'richtext3');
var doc4 = connection.get('KQ', 'richtext4');
var doc5 = connection.get('KQ', 'richtext5');
var doc6 = connection.get('KQ', 'richtext6');
var doc7 = connection.get('KQ', 'richtext7');
var doc8 = connection.get('KQ', 'richtext8');
var counter = connection.get('KQ', 'counter');
var timer = connection.get('KQ','timer1')

//Event Theme
doc1.subscribe(function(err) {
  if (err) throw err;
  var quill1 = new Quill('#theme-event');
  quill1.setContents(doc1.data);
  quill1.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill1.getText();
    // get the maximum number of characters allowed
    var maxLength = 50; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill1.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill1.setSelection(maxLength, maxLength);
    }
    doc1.submitOp(delta, {source: quill1});
  });
  doc1.on('op', function(op, source) {
    if (source === quill1) return;
    quill1.updateContents(op);
  });
});

//Picture Theme
doc2.subscribe(function(err) {
  if (err) throw err;
  var quill2 = new Quill('#theme-picture');
  quill2.setContents(doc2.data);
  quill2.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill2.getText();
    // get the maximum number of characters allowed
    var maxLength = 50; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill2.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill2.setSelection(maxLength, maxLength);
    }
    doc2.submitOp(delta, {source: quill2});
  });
  doc2.on('op', function(op, source) {
    if (source === quill2) return;
    quill2.updateContents(op);
  });
});

//Montage Theme
doc3.subscribe(function(err) {
  if (err) throw err;
  var quill3 = new Quill('#theme-montage');
  quill3.setContents(doc3.data);
  quill3.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill3.getText();
    // get the maximum number of characters allowed
    var maxLength = 50; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill3.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill3.setSelection(maxLength, maxLength);
    }
    doc3.submitOp(delta, {source: quill3});
  });
  doc3.on('op', function(op, source) {
    if (source === quill3) return;
    quill3.updateContents(op);
  });
});

//Scavenger Theme
doc4.subscribe(function(err) {
  if (err) throw err;
  var quill4 = new Quill('#theme-scav');
  quill4.setContents(doc4.data);
  quill4.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill4.getText();
    // get the maximum number of characters allowed
    var maxLength = 50; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill4.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill4.setSelection(maxLength, maxLength);
    }
    doc4.submitOp(delta, {source: quill4});
  });
  doc4.on('op', function(op, source) {
    if (source === quill4) return;
    quill4.updateContents(op);
  });
});


//Leads
doc5.subscribe(function(err) {
  if (err) throw err;
  var quill5 = new Quill('#leads');
  quill5.setContents(doc5.data);
  quill5.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    doc5.submitOp(delta, {source: quill5});
  });
  doc5.on('op', function(op, source) {
    if (source === quill5) return;
    quill5.updateContents(op);
  });
});


//Response
doc6.subscribe(function(err) {
  if (err) throw err;
  var quill6 = new Quill('#response');
  quill6.setContents(doc6.data);
  quill6.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    doc6.submitOp(delta, {source: quill6});
  });
  doc6.on('op', function(op, source) {
    if (source === quill6) return;
    quill6.updateContents(op);
  });
});


// Get initial value of document and subscribe to changes
counter.subscribe(showNumbers);
// When document changes (by this client or any other, or the server),
// update the number on the page
counter.on('op', showNumbers);

//Question Text
doc7.subscribe(function(err) {
  if (err) throw err;
  var quill7 = new Quill('#question-text');
  quill7.setContents(doc7.data);
  quill7.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    doc7.submitOp(delta, {source: quill7});
  });
  doc7.on('op', function(op, source) {
    if (source === quill7) return;
    quill7.updateContents(op);
  });
});

//Points
doc8.subscribe(function(err) {
  if (err) throw err;
  var quill8 = new Quill('#question-points');
  quill8.setContents(doc8.data);
  quill8.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    // get the current text in the editor
    var text = quill8.getText();
    // get the maximum number of characters allowed
    var maxLength = 4; // set to whatever value you want
    if (text.length > maxLength) {
      // if the text is too long, remove the excess characters
      quill8.setText(text.slice(0, maxLength));
      // move the cursor to the end of the line
      quill8.setSelection(maxLength, maxLength);
    }
    doc8.submitOp(delta, {source: quill8});
  });
  doc8.on('op', function(op, source) {
    if (source === quill8) return;
    quill8.updateContents(op);
  });
});

function showNumbers() {
  document.querySelector('#question-number').textContent = counter.data.numClicks;
};

// When clicking on the '+1' button, change the number in the local
// document and sync the change to the server and other connected
// clients
function increment() {
  // Increment `doc.data.numClicks`. See
  // https://github.com/ottypes/json0 for list of valid operations.
  counter.submitOp([{p: ['numClicks'], na: 1}]);
}

// Expose to index.html
global.increment = increment;


//Question Timer:
let remainingTime = 0;
let originalTime = '';
let timerId;

const inputField = document.getElementById('question-timer');
const timerBtn = document.getElementById('timerBtn');

function subscribeToTimer() {
  // Get initial value of document and subscribe to changes
  timer.subscribe(function(err) {
    if (err) throw err;
    // Start the timer with the initial value from the sharedb document
    remainingTime = timer.data.remainingTime || 0;
    originalTime = timer.data.originalTime || '';
    updateTimerElement(remainingTime);
  });

  // Add an event listener to the sharedb document to update the timer element
  timer.on('op', function(op, source) {
    if (source !== false) return;
    remainingTime = timer.data.remainingTime || 0;
    updateTimerElement(remainingTime);
  });
}

// Update the sharedb document with the current remaining time
function updateTimerDoc() {
  timer.fetch(function(err) {
    if (err) throw err;

    var remainingTime = timer.data.remainingTime || 0;
    timer.submitOp([{ p: ['remainingTime'], na: -1, v: timer.version + 1 }], function(err) {
      if (err) throw err;
    });
  });
}


function startTimer() {
  let timeInMinutes = inputField.value.trim();

  if (!timeInMinutes) {
    // If no time input, do nothing
    return;
  }

  timeInMinutes = parseFloat(timeInMinutes);

  if (remainingTime > 0) {
    // Stop the timer if it's already running
    clearInterval(timerId);
    timerId = null;
    remainingTime = 0;
    timerBtn.textContent = 'Start';
    inputField.disabled = false;
    inputField.value = originalTime;
    timer.submitOp([{ p: ['remainingTime'], na: remainingTime }]);
    return;
  }

  originalTime = inputField.value;
  remainingTime = timeInMinutes * 60;

  // Update the sharedb document with the original time and remaining time
  timer.submitOp([{ p: ['originalTime'], oi: originalTime }]);
  timer.submitOp([{ p: ['remainingTime'], oi: remainingTime }]);

  updateTimerElement(remainingTime);

  // Start the timer
  timerId = setInterval(function() {
    if (remainingTime <= 0) {
      clearInterval(timerId);
      timerId = null;
      timerBtn.textContent = 'Start';
      inputField.disabled = false;
      inputField.value = originalTime;
      // Update the sharedb document with the remaining time
      timer.submitOp([{ p: ['remainingTime'], na: remainingTime }]);
    } else {
      remainingTime--;
      updateTimerDoc();
      updateTimerElement(remainingTime);
    }
  }, 1000);

  // Disable the input field and update the button text
  inputField.disabled = true;
  timerBtn.textContent = 'Stop';
}

function updateTimerElement(remainingTime) {
  const timerElement = document.getElementById('timer');
  if (!timerElement) return;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

subscribeToTimer();

timerBtn.addEventListener('click', function() { startTimer(); });

//Save Question Info
function saveQuestionResult(result) {
  const data = {
    questionNumber: document.getElementById('question-number').textContent,
    questionText: document.getElementById('question-text').textContent,
    answer: document.getElementById('response').textContent,
    possiblePoints: document.getElementById('question-points').textContent,
    result: result
  };

  localStorage.setItem('questionResult', data);
  console.log("logged data", data)
}

const wonBtn = document.getElementById('wonBtn');
const lostBtn = document.getElementById('lostBtn');

wonBtn.addEventListener('click', function() {saveQuestionResult('won');});

lostBtn.addEventListener('click', function() {saveQuestionResult('lost');});
