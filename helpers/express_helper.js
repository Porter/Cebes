module.exports = {
  sendFile: sendFile
};

function sendFile(req, res, file, options) {
  res.render(file, {req: req});
}