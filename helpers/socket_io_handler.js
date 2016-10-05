const DocumentInstanceManager = require("./document_instance_manager");
const Edit = require("../models/edit");

const documentInstanceManager = new DocumentInstanceManager();

function handle(io) {
  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('init', documentId => {
      documentInstanceManager.openDocument(documentId).then(doc => {
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
      documentInstanceManager.processEdit(edit).then(results => {
        socket.emit("edit processed", edit.getNumber());
      })
      .catch(err => {
        console.log(err);
      });
    });
  });
}

module.exports = {
  handle: handle
}
