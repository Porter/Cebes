const EditProcessor = require('../../helpers/edit_processor');
const editHelper = require('../../helpers/edit_helper');
const Edit = require("../../models/edit");
const Document = require("../../models/document");
const expect = require('chai').expect;

describe("EditProcessor", () => {
  before(done => {
    Document.init().then(r => {
      done();
    }).catch(done);
  })
  describe("process", () => {
    it("can processe an edit", done => {
      Document.create({}).then(doc => {
        const editProcessor = new EditProcessor(doc);

        const diff = editHelper.textDiff(doc.text, "abc");
        const edit = new Edit({diff: diff});

        editProcessor.process(edit).then(() => {
          try {
            expect(doc.text).to.eql("abc");
            done();
          }
          catch(e) { done(e); }
        }).catch(done);
      }).catch(done);
    });
  });
});
