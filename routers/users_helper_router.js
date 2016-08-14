const express = require("express");
const bcrypt = require('bcrypt');
const DB = require("../helpers/db");
const usersHelper = require("../helpers/users_helper");
const passportHelper = require("../helpers/passport_helper");
const UserNotFoundError = require("../errors/user_not_found_error");



DB.init();

const usersRouter = express.Router();

usersRouter.get("/get", (req, res) => {
  usersHelper.getAll()
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e}) } );
});

usersRouter.post("/create", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  usersHelper.createUser({username: username, password: password})
  .then(result => {
    passportHelper.login({username:username}, { successRedirect: '/' })(req, res, next);
  })
  .catch(e => { res.json({error:e.message}); });
});

usersRouter.use('/destroy_session', passportHelper.logout({successRedirect:'/'}));

usersRouter.post("/create_session",
  passportHelper.authenticate({
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  (req, res) => {
  res.end('');
});

module.exports = usersRouter;