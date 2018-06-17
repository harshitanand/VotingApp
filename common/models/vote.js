'use strict';

const LoopBackContext = require('loopback-context');
const Promise = require('bluebird');

module.exports = Vote => {
  Vote.observe('before save', (ctx, next) => {
    const currentUser = LoopBackContext.getCurrentContext().get('currentUser');
    let target = ctx.data;
    const options = ctx.options;
    if (ctx.instance) {
      target = ctx.instance;
    }
    target.userId = currentUser.id;
    next();
  });
};
