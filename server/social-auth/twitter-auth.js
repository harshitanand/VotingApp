'use strict';

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const queryString = require('querystring');
const CustomError = require('../errors/custom-error');

module.exports = function(app, passportLogin, passportLink, config) {
  const twitter = config['twitter-login'];
  const UserIdentity = app.models.userIdentity;
  const redirectPath = 'login-redirect';

  const passportCB = async (token, tokenSecret, profile, done) => {
    if (!profile.emails[0].value) return done(new CustomError('email is missing from the user profile', {}, 400));
    profile.email = profile.emails[0].value;

    const { identity, user, accessToken } = await UserIdentity.login('twitter-login', 'oauth 1.0', profile, token);
    const response = {
      provider: identity.provider,
      email: identity.email,
      identityToken: identity.token,
      fullName: identity.profile.displayName, // eslint-disable-line no-use-before-define
    };

    if (accessToken) {
      response.accessToken = accessToken.id;
    }

    if (user) {
      response.mobileNumber = user.mobileNumber;
      response.userId = user.id;
      response.admin = user.admin;
    }
    return done(null, response);
  };

  passportLogin.use(
    new TwitterStrategy(
      {
        consumerKey: twitter.consumerKey,
        consumerSecret: twitter.consumerSecret,
        callbackURL: twitter.callbackURL,
        includeEmail: true,
      },
      passportCB
    )
  );

  app.get(
    twitter.authPath,
    passportLogin.authenticate('twitter', {
      scope: ['include_email=true'],
      faliureRedirect: '/login',
      session: false,
    })
  );

  app.get(twitter.callbackURL, passportLogin.authenticate('twitter', { session: false }), (req, res) => {
    res.redirect(`${twitter[redirectPath]}?${queryString.stringify(req.user)}`);
  });
};
