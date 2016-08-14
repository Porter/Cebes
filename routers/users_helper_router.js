const express = require("express");
const bcrypt = require('bcrypt');
const DB = require("../helpers/db");
const usersHelper = require("../helpers/users_helper");
const UserNotFoundError = require("../errors/user_not_found_error");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  usersHelper.getUser({id:id})
  .then(user => {
    user.getLogin = function() {
      return this.username || this.email;
    };
    done(null, user);
  })
  .catch(e => { done(e); });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    usersHelper.getUser({username: username})
    .then(user => {
      console.log(password);
      console.log(user.passhash);
      bcrypt.compare(password, user.passhash, function(err, res) {
        if (err) return done(err);

        if (res) {
          return done(null, user);
        }
        else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    })
    .catch(e => {
      if (e instanceof UserNotFoundError) {
        console.log(e.message);
        return done(null, false, { message: 'Incorrect username.' });
      }
      done(e);
    });
  }
));

DB.init();

const usersRouter = express.Router();

usersRouter.get("/get", (req, res) => {
  usersHelper.getAll()
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e}) } );
});

usersRouter.post("/create", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  usersHelper.createUser({username: username, password: password})
  .then(result => { res.json(result); })
  .catch(e => { res.json({error:e.message}); });
});

usersRouter.post("/create_session",
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  (req, res) => {
  res.end('');
});

module.exports = usersRouter;