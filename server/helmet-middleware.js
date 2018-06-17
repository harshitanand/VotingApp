'use strict';

const helmet = require('helmet');

module.exports = function(app) {
  // avoid clickjacking
  // app.use(helmet.xframe('deny'));

  // Hide X-Powered-By
  app.use(helmet.hidePoweredBy());

  // Implement Strict-Transport-Security
  app.use(
    helmet.hsts({
      maxAge: 7776000000,
    })
  );

  // Implement X-XSS-Protection
  app.use(helmet.xssFilter());

  // Implement nosniff
  app.use(helmet.noSniff());
};
