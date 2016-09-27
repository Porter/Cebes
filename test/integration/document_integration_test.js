const expect = require('chai').expect;
const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs');
const binPath = phantomjs.path;


function getScript(name) {
  return path.join(__dirname, '/phantomjs/documents', name + '.js');
}

describe('User visits signup page @integration', () => {

  it('should be successful', done => {
    childProcess.execFile(binPath, [getScript('visit_status')], function(err, stdout, stderr) {
      stdout = stdout.trim();
      expect(err).to.not.exist;
      expect(stdout).to.eql("success");
      done();
    })
  });

  describe('root page content', () => {
    it('should have a new button', done => {
      childProcess.execFile(binPath, [getScript('rootText')], function(err, stdout, stderr) {
        stdout = stdout.trim();
        expect(err).to.not.exist;
        expect(stdout).to.contain("New");
        done();
      });
    });

    describe("links", () => {
      var links;
      before(done => {
        childProcess.execFile(binPath, [getScript('getLinks')], function(err, stdout, stderr) {
          links = stdout.trim().split('\n');
          expect(err).to.not.exist;
          done();
        });
      });

      it('should have a link to signup', () => {
        expect(links[0]).to.contain("/users/login");
      });

      it('should have a link to login', () => {
        expect(links[1]).to.contain("users/signup");
      });
    });

    it('should have a clickable button to create a new document', done => {
      childProcess.execFile(binPath, [getScript('rootText')], function(err, stdout, stderr) {
        stdout = stdout.trim();
        expect(err).to.not.exist;
        expect(stdout).to.contain("New");
        done();
      });
    });
  });
  //
  // describe("edit view", () => {
  //   it("should have a focusable div with the id 'rootDiv'", () => {
  //     browser.assert.evaluate(`$('#rootDiv').focus()`);
  //   });
  //
  //   it("should have a changable div with the id 'rootDiv'", () => {
  //     browser.assert.evaluate(`$('#rootDiv').html('asdf')`);
  //     browser.assert.evaluate(`$('#rootDiv').html()`, 'asdf');
  //   });
  //
  //   it("should update the document in the db'", done => {
  //     console.log(browser.tabs[0]._request.url);
  //     done();
  //   });
  // });
});
