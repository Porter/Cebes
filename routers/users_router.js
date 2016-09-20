const express = require("express");
const expressHelper = require("../helpers/express_helper");
const passportHelper = require("../helpers/passport_helper");
const User = require("../models/user");
const usersHelper = require("../helpers/users_helper");

const usersRouter = express.Router();

usersRouter.get("/login", (req, res) => {
  expressHelper.sendFile(req, res, "login.ejs");
});

usersRouter.get("/logout", (req, res) => {
  res.redirect("/users/destroy_session");
});

usersRouter.get("/signup", (req, res) => {
  expressHelper.sendFile(req, res, "signup.ejs");
});


usersRouter.get("/get", (req, res) => {
  User.getAll()
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e}) } );
});

usersRouter.post("/create", (req, res, next) => {
  const passwd = req.body.password;
  delete req.body.password;
  usersHelper.hashPassword(passwd).then(hashed => {
    req.body.passhash = hashed;
    User.create(req.body)
    .then(user => {
      passportHelper.login({username:user.username}, { successRedirect: '/' })(req, res, next);
    })
    .catch(e => {
      console.log(e);
      res.redirect('/users/signup');
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.end("Error parsing password");
  });
});

usersRouter.use('/destroy_session', passportHelper.logout({successRedirect:'/'}));

usersRouter.post("/create_session",
  passportHelper.authenticate({
    successRedirect: '/',
    failureRedirect: '/users/login'
  }),
  (req, res) => {
  res.end('');
});

module.exports = usersRouter;
