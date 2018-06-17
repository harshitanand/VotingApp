'use strict';

const path = require('path');
const config = require('../config');
const _ = require('underscore');
const queryString = require('querystring');
const bodyParser = require('body-parser');
const helperUtils = require('../helper-utils');
const Promise = require('bluebird');

const env = process.env.NODE_ENV || 'development';

module.exports = function(app) {
  app.get('/social', (req, res) => {
    const template = app.loopback.template(path.resolve(__dirname, '../views/social-auth.ejs'));
    const html = template({ link: false });
    return res.send(html);
  });
};
