const express = require("express");
const expressHelper = require("../helpers/express_helper");

const documentsRouter = express.Router();

documentsRouter.get("/", (req, res) => {
  res.end("root");
});

documentsRouter.get("/edit", (req, res) => {
  res.end("edit")
});

module.exports = documentsRouter;
