const editHelper = require('../../helpers/edit_helper');
const expect = require('chai').expect;

describe("editHelper", () => {
  describe('#textDiff', () => {
    it("finds the difference between an empty string and abc", () => {
      const diff = editHelper.textDiff('', 'abc');
      expect(diff).to.eql([ {i: 0, val:'abc'} ]);
    });
    it("finds the difference between abc and an empty string", () => {
      const diff = editHelper.textDiff('abc', '');
      expect(diff).to.eql([ {i: 0, val:3} ]);
    });
    it("finds the difference between strings", () => {
      const string1 = 'The fast dog aaaaaa over the slow fox';
      const string2 = 'The fast dog bbbbbb over the slow fox';
      const diff = editHelper.textDiff(string1, string2);
      expect(diff).to.eql([ {i:13, val:6}, {i: 19, val:"bbbbbb"} ]);
    });
  });

  describe('#applyTextDiff', () => {
    it("applys difference between an empty string and abc", () => {
      const text = '', diff = [ {i: 0, val:'abc'} ];
      const newText = editHelper.applyTextDiff(text, diff);
      expect(newText).to.eql('abc');
    });
    it("applys difference between abc and an empty string", () => {
      const text = 'abc', diff = [ {i: 0, val:3} ];
      const newText = editHelper.applyTextDiff(text, diff);
      expect(newText).to.eql('');
    });
    it("applies a replacement", () => {
      const text = 'The fast dog jumped over the slow fox';
      const diff = [ {i:34, val:3}, {i: 37, val:"red"} ];
      const newText = editHelper.applyTextDiff(text, diff);
      expect(newText).to.eql('The fast dog jumped over the slow red');
    })
  });
});
