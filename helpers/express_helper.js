const _ = require("lodash");

module.exports = {
  sendFile: sendFile
};

function sendFile(req, res, file, options) {
  const renderOptions = {req: req};
  _.merge(renderOptions, options);
  res.render(file, renderOptions);
}
