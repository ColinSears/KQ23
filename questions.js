const sharedb = require('sharedb/lib/client');
const ReconnectingWebSocket = require('reconnecting-websocket');

const socketProtocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
const socketHost = window.location.host;
const socket = new ReconnectingWebSocket(`${socketProtocol}//${socketHost}/websocket`);
const connection = new sharedb.Connection(socket);

// Initialize the ShareDB document
const doc = connection.get('mycollection', 'mydocument');

// Initialize an empty array to store the data
let questionData = [];

// Add event listeners to the buttons and question number div
const wonButton = document.getElementById('won-button');
const lostButton = document.getElementById('lost-button');
const questionNumberDiv = document.getElementById('question-number');

// Set the initial question number
let questionNumber = 1;
questionNumberDiv.textContent = questionNumber;

// Add event listeners to the buttons
wonButton.addEventListener('click', () => {
  let questionText = document.getElementById('dash-question').value;
  let pointsPossible = document.getElementById('dash-points').value;
  let answer =  document.getElementById('dash-res').value;

  // Create an object to represent the data
  let dataObject = {
    questionNumber: questionNumber,
    questionText: questionText,
    answer: answer,
    pointsPossible: pointsPossible,
    result: 'won'
  };

  // Add the object to the array
  questionData.push(dataObject);

  // Increment the question number and update the display
  questionNumber++;
  questionNumberDiv.textContent = questionNumber;

  // Save the data to the ShareDB document
  doc.submitOp([{p: ['questionData', questionData.length - 1], li: dataObject}]);
});

lostButton.addEventListener('click', () => {
  let questionText = document.getElementById('dash-question').value;
  let pointsPossible = document.getElementById('dash-points').value;
  let answer =  document.getElementById('dash-res').value;

  // Create an object to represent the data
  let dataObject = {
    questionNumber: questionNumber,
    questionText: questionText,
    answer: answer,
    pointsPossible: pointsPossible,
    result: 'lost'
  };

  // Add the object to the array
  questionData.push(dataObject);

  // Increment the question number and update the display
  questionNumber++;
  questionNumberDiv.textContent = questionNumber;

  // Save the data to the ShareDB document
  doc.submitOp([{p: ['questionData', questionData.length - 1], li: dataObject}]);
});

// Listen for changes to the ShareDB document
doc.subscribe(() => {
  if (doc.data) {
    questionData = doc.data.questionData || [];
    // Call your function to update the table here
  }
});

//Lock Points Box
const taMax = document.getElementById('dash-points');
taMax.addEventListener('input', function() {
  if (taMax.value.length > 4) {
    taMax.value = taMax.value.slice(0, taMax.maxLength); // remove excess characters
    taMax.disabled = true; // disable the textarea
  }
});
