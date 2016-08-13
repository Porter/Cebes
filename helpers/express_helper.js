module.exports = {
  sendFile: sendFile
};

function sendFile (res, file, options) {
  res.render(file);
}