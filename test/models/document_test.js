const Document = require('../../models/document');
const expect = require('chai').expect;

describe("Document", () => {
  before(done => {
    Document.init().then(removedCount => {
      done();
    }).catch(done);
  })
  describe('#create', () => {
    it("loads the properties", (done) => {
      Document.create({}).then(doc => {
        expect(doc).to.have.property('text', '');
        expect(doc).to.have.property('history');
        expect(doc).to.have.property('id');
        done();
      });
    });

    it("has savable properties", (done) => {
      Document.create({}).then(doc => {
        doc.text = "DF";
        doc.save().then(() => {
          Document.findOne({where: {id: doc.id}}).then(doc2 => {
            try {
              expect(doc2).to.have.property('text', 'DF');
              done();
            }
            catch(e) { done(e); }
          }).catch(done);
        }).catch(done);
      });
    });
  });
});
