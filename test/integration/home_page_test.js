const expect = require('chai').expect;
const testHelper = require("./test_helper");

const folder = "home";

describe('User visits signup page @integration', () => {

  it('should be successful', done => {
    testHelper.run(folder, "visit_status").then(done).catch(done);;
  });

  describe('home page content', () => {
    it('should have hello world', done => {
      testHelper.run(folder, "has_hello_world").then(done).catch(done);;
    });

    it('should have a link to signup and login', done => {
      testHelper.run(folder, "links").then(done).catch(done);;
    });
  });
});
