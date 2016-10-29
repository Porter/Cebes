const editHelper = require('../helpers/edit_helper');

let text, lastSentText, div, inited = false;

function getDivText() {
  const childNodes = div.childNodes;
  var text = '';
  for (var i = 0; i < childNodes.length; i++) {
    text += childNodes[i].textContent + '\n';
  }
  return text;
}

function setDivText(text) {
  var t = '';
  const texts = text.split('\n');
  texts.forEach(text => {
    t += "<div>" + text + "</div>";
  });
  div.innerHTML = t;
}

function getDiv() {
  return div;
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
  getDiv: getDiv,
  setDivText: setDivText,
  getDivText: getDivText,
  isUpToDate: isUpToDate,
  testing: require("./testing")
};
