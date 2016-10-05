const Promise = require("bluebird");
const expect = require('chai').expect;
const testHelper = require("./test_helper")
const Document = require("../../models/document")

const folder = "documents";

function waitForIt(fn, times) {
  return new Promise(function(resolve, reject) {
    fn().then(resolve).catch(e => {
      if (times <= 1) {
        return reject(e);
      }
      setTimeout(function() {
        waitForIt(fn, times-1).then(resolve).catch(reject);
      }, 100);
    });
  });
}

describe('User visits signup page @integration', () => {

  it('should be successful', done => {
    testHelper.run(folder, "visit_status").then(done).catch(done);
  });

  describe('root page content', () => {
    it('should have a new button', done => {
      testHelper.run(folder, "has_new_button").then(done).catch(done);
    });

    describe("links", () => {
      it('should have a link to signup and login', done => {
        testHelper.run(folder, "getLinks").then(done).catch(done);
      });
    });

    it('should have a clickable button to create a new document', done => {
      testHelper.run(folder, "has_new_button").then(done).catch(done);
    });
  });

  describe("edit view", () => {

    before(done => {
      Document.sync({force: true}).then(removedCount => {
        testHelper.run(folder, "edit_view").then(done).catch(done);
      }).catch(done);
    });

    it("should be accessable from the button at /documents", () => {

    });

    it("should be an id of 1", () => {

    });

    it("should have a changable div with the id 'rootDiv'", () => {
    });

    it("should have the changes even after a refresh", () => {
    });

    it("should update the document in the db", done => {
      waitForIt(() => {
        return new Promise(function(resolve, reject) {
          Document.findOne({where:{id:1}}).then(doc => {
            try {
              expect(doc.text).to.eql('abc');
              resolve();
            }
            catch (e) { reject(e); }
          }).catch(done);
        });
      }, 10).then(done).catch(done);
    });
  });
});
