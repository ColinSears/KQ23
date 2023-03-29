const sharedb = require('sharedb/lib/client');
const StringBinding = require('sharedb-string-binding');
const ReconnectingWebSocket = require('reconnecting-websocket');

const socketProtocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
const socketHost = window.location.host;
const socket = new ReconnectingWebSocket(`${socketProtocol}//${socketHost}/websocket`);
const connection = new sharedb.Connection(socket);

const scav = document.getElementById('scav');