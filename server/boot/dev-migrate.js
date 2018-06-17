'use strict';

const env = process.env.NODE_ENV || 'development';
const async = require('async');

module.exports = function(app, cb) {
  if (env !== 'development') {
    return cb();
  }

  const dummyModels = ['AccessToken', 'UserCredential', 'UserIdentity'];
  const appModels = Object.keys(app.models);

  dummyModels.forEach(dummyModel => {
    const index = appModels.indexOf(dummyModel);
    if (index > -1) {
      appModels.splice(index, 1);
    }
  });

  const ds = app.dataSources.postgreDS;

  const asyncDone = () => cb();

  const migrateModel = (model, callback) =>
    ds.isActual(model, (err, actual) => {
      if (!actual) {
        console.log(`Auto updating ${model}`); // eslint-disable-line no-console
        return ds.autoupdate(model, err2 => {
          if (err2) {
            throw err2;
          }
          return callback();
        });
      }
      return callback();
    });

  return async.eachSeries(appModels, migrateModel, asyncDone);
};
