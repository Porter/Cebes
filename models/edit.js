class Edit {
  constructor(options) {
    this.diff = options.diff;
    this.number = options.number;
    this.confirmed = options.confirmed;
    this.documentId = options.documentId;
  }

  getDiff() { return this.diff; }
  getNumber() { return this.number; }
  getDocumentId() { return this.documentId; }
  isConfirmed() { return this.confirmed; }
}

module.exports = Edit;
