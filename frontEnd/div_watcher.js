const editHelper = require('../helpers/edit_helper');

let text, lastSentText, div, inited = false;

function getDivText() {
  return div.textContent;
}

function setDivText(text) {
  div.innerHTML = text;
}

function init(doc) {
  div = document.getElementById("rootDiv");
  setDivText(doc.text);
  text = lastSentText = doc.text;
  inited = true;
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
  text = lastSentText = getDivText();
  check(div, eventEmmitter);
}

function isUpToDate() {
  return getDivText() == lastSentText;
}

function isInited() {
  return inited;
}

module.exports = {
  watch: watch,
  init: init,
  isInited: isInited,
  isUpToDate: isUpToDate
};
