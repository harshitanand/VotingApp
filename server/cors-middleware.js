'use strict';

module.exports = function(app) {
  // eslint-disable-next-line global-require

  const enableCORS = function(req, res, next) {
    if (req.get('origin')) {
      res.header('Access-Control-Allow-Origin', req.get('origin'));
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Credentials', true);
      res.header(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Content-Type, Authorization, Content-Length, X-Requested-With, Pragma, Cache-Control, rm-client-version, rm_client_version, rm-client-name, rm_client_name, If-Modified-Since, withCredentials, sessionId, sessionid'
      );

      // intercept OPTIONS method
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    } else {
      next();
    }
  };

  // enable CORS!
  app.use(enableCORS);
};
