'use strict';

module.exports = function(server) {
  const restApiRoot = server.get('restApiRoot');
  server.use(restApiRoot, server.loopback.rest());
};
