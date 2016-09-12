const editHelper = require("../helpers/edit_helper");
const DB = require("../helpers/db");
const Promise = require("bluebird");

class Document {

  constructor() {
    this.text = '';
    this.history = [];
  }

  append(edit) {
    this.history.push(edit);
    this.text = editHelper.applyTextDiff(this.text, edit.diff);
  }

  // save() {
  //   return new Promise(function(resolve, reject) {
  //     DB.s
  //   });
  // }

}

module.exports = Document;
