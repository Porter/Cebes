const Promise = require("bluebird");

class FrontEndDocument {
  constructor(divWatcher) {
    this.divWatcher = divWatcher;
    this.text = divWatcher.getDivText();
  }

  save() {
    const divWatcher = this.divWatcher;
    const text = this.text;
    return new Promise(function(resolve, reject) {
      divWatcher.setDivText(text);
    });
  }
}

module.exports = FrontEndDocument;
