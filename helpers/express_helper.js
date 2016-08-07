module.exports = {
  sendFile: sendFile
};

function sendFile (res, file, options) {
  res.sendFile(file, options);
}