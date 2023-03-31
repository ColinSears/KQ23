var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
var richText = require('rich-text');
var Quill = require('quill');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
var socket = new ReconnectingWebSocket('ws://' + window.location.host);
var connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
var counter = connection.get('KQ', 'counter');
var doc1 = connection.get('KQ', 'richtext1');
var doc2 = connection.get('KQ', 'richtext2');
var timer = connection.get('KQ','timer')

// Get initial value of document and subscribe to changes
counter.subscribe(showNumbers);
// When document changes (by this client or any other, or the server),
// update the number on the page
counter.on('op', showNumbers);

//Question Text
doc1.subscribe(function(err) {
  if (err) throw err;
  var quill1 = new Quill('#question-text');
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

//Points
doc2.subscribe(function(err) {
  if (err) throw err;
  var quill2 = new Quill('#question-points');
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
const questionNumber = 1; // Replace with the current question number
const questionText = "What is the capital of France?"; // Replace with the current question text
const possiblePoints = 10; // Replace with the possible points for the current question

function saveQuestionResult(result) {
  const data = {
    questionNumber: questionNumber,
    questionText: questionText,
    possiblePoints: possiblePoints,
    result: result
  };

  localStorage.setItem('questionResult', JSON.stringify(data));
}

const wonBtn = document.getElementById('wonBtn');
const lostBtn = document.getElementById('lostBtn');

wonBtn.addEventListener('click', function() {saveQuestionResult('won');});

lostBtn.addEventListener('click', function() {saveQuestionResult('lost');});