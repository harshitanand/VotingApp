'use strict';

const queryString = require('querystring');
const CustomError = require('../errors/custom-error');

module.exports = {
  userIdentityCB(cb) {
    return function(err, identity, user, accessToken) {
      if (err) {
        return cb(err);
      }
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

      cb(null, response, user, accessToken);
      return undefined;
    };
  },
};

function getCurrentUser(app, req) {
  return app.models.AccessToken.findById(req.query.access_token).then(accessToken =>
    app.models.RMUser.findById(accessToken.userId)
  );
}
