'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const loopbackConsole = require('loopback-console');
const path = require('path');
require('loopback-component-passport');

const session = require('express-session');
const app = loopback();

module.exports = app;

require('./helmet-middleware')(app);
require('./cors-middleware')(app);

// Server side rendering
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  process.emit('appBootDone');
  app.use(
    session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
    })
  );

  // /* eslint-disable global-require */
  require('./social-auth')(app);

  // // Only static routes should come here.
  app.use(loopback.static(path.join(__dirname, '../client/')));
  require('./index-html-middleware')(app);
  // /* eslint-enable global-require */

  // start the server if `$ node server.js`
  if (loopbackConsole.activated()) {
    loopbackConsole.start(
      app,
      // loopback-console config
      {
        prompt: 'VOTINGAPP# ',
        ignoreUndefined: false,
      }
    );
  } else if (require.main === module) {
    app.start();
  }
});
