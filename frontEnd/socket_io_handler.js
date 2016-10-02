const EventEmitter = require('events');
const Edit = require("../models/edit");
const divWatcher = require("./div_watcher");
const queryParams = require("./query_params");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

const documentId = parseInt(queryParams['id']);

let socket = io();
socket.on('connect', function() {
  socket.emit('init', documentId);
});


window.addEventListener('load', function() {
  divWatcher.watch(myEmitter);
}, false);

myEmitter.on('text diff', diff => {
  let edit = new Edit({diff: diff, documentId: documentId})
  socket.emit("edit", edit);
});


module.exports = {
  isUpToDate: divWatcher.isUpToDate
};
