const express = require("express");
const expressHelper = require("../helpers/express_helper");
const Document = require("../models/document");

const documentsRouter = express.Router();

documentsRouter.get("/", (req, res) => {
  expressHelper.sendFile(req, res, "documents/index.ejs");
});

documentsRouter.get("/edit", (req, res) => {
  expressHelper.sendFile(req, res, "documents/edit.ejs");
});

documentsRouter.post("/create", (req, res) => {
  Document.create({}).then(doc => {
    res.redirect("/documents/edit?id=" + doc.id);
  })
  .catch(e => {
    expressHelper.return500(res, e);
  });
});

module.exports = documentsRouter;
