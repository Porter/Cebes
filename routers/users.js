const express = require("express");
const expressHelper = require("../helpers/express_helper");

const usersRouter = express.Router();

usersRouter.get("/login", (req, res) => {
  expressHelper.sendFile(res, "login.ejs");
});

usersRouter.get("/signup", (req, res) => {
  expressHelper.sendFile(res, "signup.ejs");
});


module.exports = usersRouter;