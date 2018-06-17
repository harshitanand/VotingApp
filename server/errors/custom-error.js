'use strict';

module.exports = function(message, extra, status, code) {
  if (status == null) {
    status = 500; // eslint-disable-line no-param-reassign
  }
  if (code == null) {
    code = ''; // eslint-disable-line no-param-reassign
  }
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
  this.status = status;
  this.code = code;
};

require('util').inherits(module.exports, Error);
