const EventEmitter = require('events');
const _ = require("lodash");
const Edit = require("../models/edit");
const divWatcher = require("./div_watcher");
const queryParams = require("./query_params");
const EditProcessor = require("../helpers/edit_processor");
const FrontEndDocument = require("./front_end_document")

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

const documentId = parseInt(queryParams['id']);

let ready = {
  inited: false,
  loaded: false
};
let frontEndDocument, editProcessor;

function startWatching() {
  if (_.every(_.values(ready))) {
    divWatcher.watch(myEmitter);
    frontEndDocument = new FrontEndDocument(divWatcher);
    editProcessor = new EditProcessor(frontEndDocument);
  }
}

let socket = io();
socket.on('connect', function() {
  socket.emit('init', documentId);
});

window.addEventListener('load', function() {
  console.log("loaded");
  ready.loaded = true;
  startWatching();
}, false);

socket.on('init', doc => {
  console.log("inited with", doc);
  divWatcher.init(doc);
  ready.inited = true;
  startWatching();
});

socket.on('edit', edit => {
  edit = new Edit(edit);
  editProcessor.process(edit);
})

myEmitter.on('text diff', diff => {
  let edit = new Edit({diff: diff, documentId: documentId})
  socket.emit("edit", edit);
});


module.exports = divWatcher;
