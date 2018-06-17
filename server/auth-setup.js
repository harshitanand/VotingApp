'use strict';

module.exports = function(app) {
  // eslint-disable-next-line global-require
  const loopbackPassport = require('loopback-component-passport');
  const { PassportConfigurator } = loopbackPassport;
  const passportConfigurator = new PassportConfigurator(app);
  let authProviderConfig = {};
  try {
    // eslint-disable-next-line global-require
    authProviderConfig = require('./auth-providers.json');
  } catch (err) {
    console.trace(err); // eslint-disable-line no-console
    process.exit(1);
  }

  passportConfigurator.setupModels({
    userModel: app.models.AppUser,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential,
  });

  return (() => {
    const result = [];
    // eslint-disable-next-line
    for (const k in authProviderConfig) {
      const v = authProviderConfig[k];
      result.push(passportConfigurator.configureProvider(k, v));
    }
    return result;
  })();
};
