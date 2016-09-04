const Document = require('../../models/document');
const expect = require('chai').expect;

describe("Document", () => {
  describe('constructor', () => {
    it("loads some properies", () => {
      const doc = new Document();
      expect(doc).to.have.property('text');
      expect(doc).to.have.property('history');
    });
  });
});