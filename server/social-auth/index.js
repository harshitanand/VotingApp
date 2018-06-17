'use strict';

const Passport = require('passport').Passport;

const passportLink = new Passport();
const passportLogin = new Passport();

let config;

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  config = require('../auth-providers.production.json');
} else if (process.env.NODE_ENV === 'test') {
  config = require('../auth-providers.test.js');
} else if (process.env.NODE_ENV === 'staging') {
  config = require('../auth-providers.staging.json');
} else {
  config = require('../auth-providers.json');
  /* eslint-enable global-require */
}

module.exports = function(app) {
  app.use(passportLogin.initialize());
  app.use(passportLogin.session());
  app.use(passportLink.initialize());

  passportLogin.serializeUser((user, callback) => {
    console.log(user);
    callback(null, user);
  });

  passportLogin.deserializeUser((user, callback) => {
    console.log(user);
    callback(null, user);
  });

  /* eslint-disable global-require */
  require('./twitter-auth')(app, passportLogin, passportLink, config);
  // require('./facebook-auth')(app, passportLogin, passportLink, config);
  // require('./linkedIn-auth')(app, passportLogin, passportLink, config);
  // require('./truecaller-auth')({ app, config });
  /* eslint-enable global-require */
};
