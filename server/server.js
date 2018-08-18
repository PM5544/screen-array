const http = require('http');
const { controlServer } = require('./io');
const { readFile } = require('fs');
const url = require('url');
const { join } = require('path');
const dir = __dirname;

module.exports = http.createServer(function(request, response) {
  const { pathname } = url.parse(request.url);

  if (pathname.includes('/errors') && request.method === 'POST') {
    let bodyData = '';
    request.on('data', data => {
      bodyData += data;
    });
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    request.on('end', () => {
      response.end();
      controlServer.emit('clientError', bodyData);
    });
    return;
  }
  readFile(join(dir, '..', 'static', pathname), (error, data) => {
    if (error) {
      response.writeHead(404);
    } else {
      if (pathname.endsWith('.css')) {
        response.writeHead(200, { 'Content-Type': 'text/css' });
      } else if (pathname.endsWith('.html')) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
      } else if (pathname.endsWith('.mjs') || pathname.endsWith('.js')) {
        response.writeHead(200, { 'Content-Type': 'application/javascript' });
      }
      response.write(data, 'utf8');
    }
    response.end();
  });
});
