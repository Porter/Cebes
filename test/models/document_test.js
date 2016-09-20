const Document = require('../../models/document');
const expect = require('chai').expect;

describe("Document", () => {
  before(done => {
    Document.init().then(removedCount => {
      done();
    }).catch(done);
  })
  describe('#newEmptyDocument', () => {
    it("loads the properties", (done) => {
      Document.create({}).then(doc => {
        expect(doc).to.have.property('text');
        expect(doc).to.have.property('history');
        done();
      });
    });
  });
});
