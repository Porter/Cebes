const editHelper = require('../helpers/edit_helper');

function getRandomInsertion(text) {
  var pos = Math.floor(Math.random() * (text.length + 1));
  var char = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  if (Math.random() < .25) { char = '\n'; }
  return [ {i: pos, val: char} ];
}

function applyRandomInsertion() {
  const oldText = frontEnd.getDivText();
  const insertion = getRandomInsertion(oldText);
  const newText = editHelper.applyTextDiff(oldText, insertion);

  frontEnd.setDivText(newText);
}

module.exports = {
  applyRandomInsertion: applyRandomInsertion
};
