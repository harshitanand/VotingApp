'use strict';

const helperUtils = require('../helper-utils');

module.exports = function(app) {
  let properties;
  const dummyModels = [
    'User',
    'Meta',
    'Payment',
    'AccessToken',
    'UserCredential',
    'UserIdentity',
    'Email',
    'Container',
    'DataCoalition',
    'MailChimp',
    'Razorpay',
    'Locus',
  ];

  const appModels = Object.keys(app.models);

  dummyModels.forEach(dummyModel => {
    const index = appModels.indexOf(dummyModel);
    if (index > -1) {
      appModels.splice(index, 1);
    }
  });

  // The below code is too scary to run eslint on
  /* eslint-disable */
  return appModels.map(
    model => (
      (model = app.models[model]),
      ({ properties } = model.definition),
      (() => {
        const result = [];
        for (const k in properties) {
          let item;
          const finderMethodName = `findBy${helperUtils.capitalizeFirstLetter(k)}`;
          if (typeof model[finderMethodName] === 'undefined') {
            model[finderMethodName] = (k =>
              function(value) {
                if (!value) {
                  return null;
                } else {
                  const _where = {};
                  _where[k] = value;
                  return this.find({ where: _where });
                }
              })(k);
          }

          const finderOneMethodName = `findOneBy${helperUtils.capitalizeFirstLetter(k)}`;
          if (typeof model[finderOneMethodName] === 'undefined') {
            item = model[finderOneMethodName] = (k =>
              function(value) {
                if (!value) {
                  return null;
                } else {
                  const _where = {};
                  _where[k] = value;
                  return this.findOne({ where: _where });
                }
              })(k);
          }
          result.push(item);
        }
        return result;
      })()
    )
  );
};
