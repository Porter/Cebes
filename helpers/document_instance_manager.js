const Document = require("../models/document");
const EditProcessor = require("../helpers/edit_processor");
const DBError = require("../errors/db_error");

class DocumentInstanceManager {
  constructor() {
    this.openDocuments = {}
  }

  openDocument(documentId) {
    const openDocuments = this.openDocuments;
    return new Promise(function(resolve, reject) {
      let editProcessor = openDocuments[documentId];
      if (editProcessor) {
        return resolve(editProcessor.getDocument());
      }
      console.log("finding", {where: {id: documentId}});
      Document.findOne({where: {id: documentId}}).then(doc => {
        if (!doc) {
          return reject(new DBError("Couldn't find document with id " + documentId));
        }
        editProcessor = new EditProcessor(doc);
        openDocuments[documentId] = editProcessor;
        resolve(editProcessor.getDocument());
      }).catch(reject);
    });
  }

  processEdit(edit) {
    const documentId = edit.getDocumentId();
    const editProcessor = this.openDocuments[documentId];
    if (!editProcessor) {
      return Promise.reject(new Error("document with id " + documentId + " is not open"));
    }
    return editProcessor.process(edit);
  }
}

module.exports = DocumentInstanceManager;
