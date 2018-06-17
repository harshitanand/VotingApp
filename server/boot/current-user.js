'use strict';

const loopback = require('loopback');
const LoopBackContext = require('loopback-context');

module.exports = function(app) {
  app.use(LoopBackContext.perRequest());
  app.use(loopback.token({ model: app.models.accessToken }));
  app.use((req, res, next) => {
    if (!req.accessToken) {
      return next();
    }
    return app.models.AppUser.findById(req.accessToken.userId, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('No user with this access token was found.'));
      }
      req.currentUser = user;
      const loopbackContext = LoopBackContext.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('currentUser', user);
        loopbackContext.set('currentUrl', req.url);
        loopbackContext.set('headers', req.headers);
      }
      return next();
    });
  });
};
