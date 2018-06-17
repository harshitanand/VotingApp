'use strict';

const env = process.env.NODE_ENV || 'development';
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

module.exports = app => {
  const clientIndexStr = fs.readFileSync(path.resolve(__dirname, '..', 'client', 'index.html')).toString();

  app.get('/', (req, res) => {
    // Just send the index.html for other files to support HTML5Mode
    const ejsOptions = {};
    const html = ejs.render(clientIndexStr, ejsOptions, {
      cache: false,
      filename: 'clientIndexHtml',
    });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
    return undefined;
  });

  app.all('/*', (req, res) => {
    const { url } = req;
    const fileExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg'];
    const isRequestingFile = fileExtensions.some(ext => url.endsWith(ext));
    // Do return a 404 when a request for js or css file fails and comes here
    if (isRequestingFile) {
      return res.sendStatus(404);
    }
    // Just send the index.html for other routes to support HTML5Mode
    const ejsOptions = {};
    const html = ejs.render(
      clientIndexStr,
      {},
      {
        cache: false,
        filename: 'clientIndexHtml',
      }
    );
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
    return undefined;
  });
};
