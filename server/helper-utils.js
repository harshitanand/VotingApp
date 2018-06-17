'use strict';

const randomstring = require('randomstring');

module.exports = {
  getRandomAlphaNumericString(length, charset) {
    return randomstring.generate({
      charset: charset || '0123456789abcdefghijklmnopqrstuvwxyz',
      length: length || 8,
    });
  },

  capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  },
};
