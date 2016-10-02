const editHelper = require('../helpers/edit_helper');

let text, lastSentText;

let div;

function getDivText() {
  return div.textContent;
}

function check(div, eventEmmitter) {
  let newText = div.textContent;

  let diff = editHelper.textDiff(text, newText);
  if (diff.length != 0) {
    eventEmmitter.emit("text diff", diff);
    text = lastSentText = newText;
  }

  setTimeout(function() {
    check(div, eventEmmitter);
  }, 100);
}

function watch(eventEmmitter) {
  div = document.getElementById("rootDiv");
  text = lastSentText = getDivText();
  check(div, eventEmmitter);
}

function isUpToDate() {
  return getDivText() == lastSentText;
}

module.exports = {
  watch: watch,
  isUpToDate: isUpToDate
};
