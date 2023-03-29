const sharedb = require('sharedb/lib/client');
const ReconnectingWebSocket = require('reconnecting-websocket');

const socketProtocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
const socketHost = window.location.host;
const socket = new ReconnectingWebSocket(`${socketProtocol}//${socketHost}/websocket`);
const connection = new sharedb.Connection(socket);

socket.onopen = function() {
    console.log('WebSocket connection established');
};

const montage = document.getElementById('montage');

// Create a new sharedb document for the table data
const tableDoc = connection.get('table', 'myTable');

// Define the initial table data
const initialData = {
    rows: [
        { cols: [{ content: 'Cell 1' }, { content: 'Cell 2' }] },
        { cols: [{ content: 'Cell 3' }, { content: 'Cell 4' }] }
    ]
};

// Fetch or create the table data from the sharedb server
tableDoc.fetch(function(err) {
    if (err) throw err;

    if (tableDoc.type === null) {
        tableDoc.create(initialData, function(err) {
            if (err) throw err;

            console.log('Created new table document');
        });
    } else {
        console.log('Fetched existing table document');
    }

    console.log('tableDoc.data:', tableDoc.data);

    // Check if the rows property exists before binding it to the table element
    if (tableDoc.data && tableDoc.data.rows) {
        // Create a table element to display the table data
        const tableElem = document.createElement('table');
        tableElem.setAttribute('id', 'myTable');

        // Bind the table data to the table element using sharedb-string-binding
        const binding = new TableBinding(tableElem, tableDoc, ['rows']);
        binding.update();
        console.log('binding:', binding);
        console.log('tableElem:', tableElem);
        console.log('tableElem.innerHTML:', tableElem.innerHTML);

        // Attach a change event listener to binding
        binding.on('change', function() {
            console.log('Table data changed:', binding.get());
        });

        // Append the table element to the montage element
        montage.appendChild(tableElem);

        // Log any changes made to the table data and send them to the backend
        tableDoc.on('op', function(op, source) {
            console.log('Change:', op);
            if (!source) {
                console.log('Sending change to server:', op);
                socket.send(JSON.stringify(op));
            }
        });

        console.log('table data:', tableDoc.data);
        console.log('binding value:', binding.value);
        console.log('binding.path:', binding.path);
    }
});

function TableBinding(element, doc, path) {
    this.element = element;
    this.doc = doc;
    this.path = path;
    this.value = this.doc.data;
  
    // Update the HTML of the table element based on the current value of the sharedb document
    this.update = function() {
      const rows = this.doc.data.rows || [];
      let tableHTML = '';
      for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].cols || [];
        let rowHTML = '<tr>';
        for (let j = 0; j < cols.length; j++) {
          const content = cols[j].content || '';
          rowHTML += `<td data-row="${i}" data-col="${j}" contenteditable="true">${content}</td>`;
        }
        rowHTML += '</tr>';
        tableHTML += rowHTML;
      }
      this.element.innerHTML = tableHTML;
    };
  
    // Attach an event listener to the table element that listens for clicks on cells and replaces them with input elements for editing
    this.element.addEventListener('click', function(e) {
      if (e.target && e.target.nodeName === 'TD') {
        const cell = e.target;
        const content = cell.innerHTML;
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', content);
        input.style.width = cell.offsetWidth + 'px';
        input.style.height = cell.offsetHeight + 'px';
        input.style.border = 'none';
        input.style.padding = '0';
        input.style.margin = '0';
        input.style.fontFamily = window.getComputedStyle(cell).getPropertyValue('font-family');
        input.style.fontSize = window.getComputedStyle(cell).getPropertyValue('font-size');
        input.style.textAlign = window.getComputedStyle(cell).getPropertyValue('text-align');
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
  
        input.addEventListener('blur', function() {
          const newValue = input.value;
          const row = parseInt(cell.getAttribute('data-row'));
          const col = parseInt(cell.getAttribute('data-col'));
          const op = [{ p: ['rows', row, 'cols', col, 'content'], od: content, oi: newValue }];
          doc.submitOp(op);
          cell.innerHTML = newValue;
        });
  
        input.addEventListener('keydown', function(e) {
          if (e.keyCode === 13) {
            input.blur();
          }
        });
      }
    });
  
    // Update the HTML of the table element when the sharedb document changes
    const binding = this;
    this.doc.on('op', function(op, source) {
      if (!source) {
        binding.update();
      }
    });
  }
  
  // Add a method to the TableBinding prototype that allows event listeners to be attached to the sharedb document
  TableBinding.prototype.on = function(event, listener) {
    this.doc.on(event, listener);
  };
  