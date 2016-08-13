const express = require("express");
const DB = require("../helpers/db");
const usersHelper = require("../helpers/users_helper");

DB.init();

const usersRouter = express.Router();

usersRouter.get("/get", (req, res) => {
  usersHelper.getAll()
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e}) } );
});

usersRouter.post("/create", (req, res) => {
  const username = req.body.user.name;
  usersHelper.createUser(req.body.user)
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e.message}); });
});

usersRouter.post("/create_session", (req, res) => {
  res.end('');
});

module.exports = usersRouter;