const express = require('express');
const app = express();
const expressHelper = require("./helpers/express_helper");

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	expressHelper.sendFile(res, "html/index.html", {root: __dirname });
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});