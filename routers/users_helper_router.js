const express = require("express");
const bcrypt = require('bcrypt');
const DB = require("../helpers/db");
const usersHelper = require("../helpers/users_helper");
const passportHelper = require("../helpers/passport_helper");
const UserNotFoundError = require("../errors/user_not_found_error");
const UserValidationError = require("../errors/user_validation_error");



DB.init();

const usersRouter = express.Router();

usersRouter.get("/get", (req, res) => {
  usersHelper.getAll()
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e}) } );
});

usersRouter.post("/create", (req, res, next) => {
  usersHelper.createUser(req.body)
  .then(result => {
    passportHelper.login({username:req.body.username}, { successRedirect: '/' })(req, res, next);
  })
  .catch(e => {
    if (!(e instanceof UserValidationError)) {
      console.log(e.stack);
      return res.redirect('/signup');
    }
    res.redirect('/signup');
  });
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