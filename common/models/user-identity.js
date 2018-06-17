'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const CustomError = require('../../server/errors/custom-error');
const helperUtils = require('../../server/helper-utils');

module.exports = function(UserIdentity) {
  UserIdentity.providers = {
    facebook: 'facebook-login',
    linkedIn: 'linkedIn-login',
    google: 'google-login',
    truecaller: 'truecaller',
  };

  UserIdentity.providerSourceMap = {
    [UserIdentity.providers.facebook]: 'facebook',
    [UserIdentity.providers.linkedIn]: 'linkedIn',
    [UserIdentity.providers.google]: 'google',
    [UserIdentity.providers.truecaller]: 'truecaller',
  };

  UserIdentity.login = async (provider, authScheme, profile, credentials) => {
    const identity = await UserIdentity.findOne({
      where: {
        provider,
        email: profile.email,
      },
    });
    if (identity) {
      identity.profile = profile;
      identity.credentials = credentials;
      identity.modified = new Date();
      const _identity = await identity.save();
      const user = await AppUser.findById(_identity.userId);
      const accessToken = await user.createAccessToken(AppUser.getUserTTL(user));
      return { identity: _identity, user, accessToken };
    }
    const date = new Date();
    const user = await AppUser.create({
      fullName: profile.displayName,
      userName: profile.username,
      email: profile.email,
      emailVerified: true,
      password: helperUtils.getRandomAlphaNumericString(10),
    });

    if (!user) {
      return Promise.reject(new CustomError('No User Created'));
    }
    const _identity = await UserIdentity.create({
      provider,
      externalId: profile.id,
      authScheme,
      profile,
      credentials,
      email: profile.email,
      user,
      created: date,
      modified: date,
    });
    return { identity: _identity, user: user, accessToken: null };
  };
};
