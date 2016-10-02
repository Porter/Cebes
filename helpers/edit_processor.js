const editHelper = require("./edit_helper");

class EditProcessor {

  constructor(document) {
    this.document = document;
  }

  getDocument() {
    return this.document;
  }

  process(edit) {
    const oldText = this.document.text;
    const newText = editHelper.applyTextDiff(oldText, edit.diff);
    this.document.text = newText;
    return this.document.save();
  }

}

module.exports = EditProcessor;
