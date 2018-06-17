'use strict';

module.exports = AppUser => {
  AppUser.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance && ctx.instance) {
      // eslint-disable-next-line no-multi-assign
      ctx.instance.created = ctx.instance.lastUpdated = new Date();
    } else if (ctx.currentInstance && ctx.currentInstance.id) {
      ctx.data.lastUpdated = new Date();
    }
    return next();
  });

  AppUser.AccessTokenTTL = {
    user: 45 * 24 * 60 * 60,
    admin: 3 * 24 * 60 * 60,
  };

  AppUser.getUserTTL = user => {
    let ttl = AppUser.AccessTokenTTL.user;
    if (user.admin !== null) {
      ttl = AppUser.AccessTokenTTL.admin;
    }
    return ttl;
  };

  AppUser.accessTokenLogin = (accessTokenID, options) => {
    return accessToken.findById(accessTokenID, { include: 'user' });
  };

  AppUser.remoteMethod('accessTokenLogin', {
    description: 'Login using access token',
    accepts: [
      {
        arg: 'accessTokenID',
        type: 'string',
        required: 'true',
      },
    ],
    returns: {
      arg: 'accessToken',
      type: 'object',
      root: true,
    },
    http: {
      verb: 'post',
      path: '/accessTokenLogin',
    },
  });
};
