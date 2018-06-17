'use strict';

module.exports = function(app, cb) {
  const models = app.models;
  Object.keys(models).forEach(key => {
    global[key] = models[key];
  });
  cb();
};
