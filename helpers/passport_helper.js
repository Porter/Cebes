const DB = require("../helpers/db");
const Promise = require("bluebird");
const bcrypt = require('bcrypt');
const UserNotFoundError = require("../errors/user_not_found_error");
const usersHelper = require("../helpers/users_helper");
const _ = require("lodash");

DB.init();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function serializeUser(user, done) {
  done(null, user.id);
}

function deserializeUser(id, done) {
  usersHelper.getUser({id:id})
  .then(user => {
    user.getLogin = function() {
      return this.username || this.email;
    };
    done(null, user);
  })
  .catch(e => {
    if (e instanceof UserNotFoundError) {
      return done(null, false);
    }
    done(e);
  });
}

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

passport.use(new LocalStrategy(
  function(username, password, done) {
    usersHelper.getUser({username: username})
    .then(user => {
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

function authenticate(options) {
  return passport.authenticate('local', options);
}

function login(userLookup, options) {
  return function(req, res, next) {
    try {
      usersHelper.getUser(userLookup)
      .then(result => {
        req.login(result, err => {
          if (err) { return next(err); }
          if (_.get(options, "successRedirect")) {
            return res.redirect(options.successRedirect);
          }
          next();
        });
      })
      .catch(e => {
        console.log('error');
        if (e instanceof UserNotFoundError) {
          if (_.get(options, "failureRedirect")) {
            return res.redirect(options.failureRedirect);
          }
        }
        next(e);
      });
    }
    catch (e) {
      next(e);
    }
  }
}

function logout(options) {
  return function(req, res, next) {
    req.logout();
    res.redirect(_.get(options, "successRedirect") || "/");
  }
}

module.exports = {
  authenticate: authenticate,
  login: login,
  logout: logout
};