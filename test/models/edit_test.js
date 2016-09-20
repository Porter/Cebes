const Edit = require('../../models/edit');
const expect = require('chai').expect;

describe("Edit", () => {
  describe('constructor', () => {
    it("loads some properties", () => {
      const edit = new Edit({
        diff: [],
        number: 0,
        confirmed: false
      });
      expect(edit).to.have.property('diff');
      expect(edit).to.have.property('number');
      expect(edit).to.have.property('confirmed');
    });
  });
});
