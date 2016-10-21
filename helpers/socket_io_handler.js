const DocumentInstanceManager = require("./document_instance_manager");
const Edit = require("../models/edit");

const documentInstanceManager = new DocumentInstanceManager();

function handle(io) {
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('init', documentId => {
      documentInstanceManager.openDocument(documentId).then(doc => {
        socket.join(documentId);
        socket.emit('init', {
          text: doc.text
        });
      }).catch(err => {
        console.log(err);
      });
    });

    socket.on("edit", edit => {
      console.log("edit recieved");
      edit = new Edit(edit);
      console.log(edit);
      socket.broadcast.to(edit.documentId).emit("edit", edit);
      documentInstanceManager.processEdit(edit).then(results => {
        // socket.emit("edit processed", edit.getNumber());
      })
      .catch(err => {
        console.log(err);
      });
    });
  });
}

function reset() {
  documentInstanceManager.reset();
}

module.exports = {
  handle: handle,
  reset: reset
}
