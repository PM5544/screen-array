import http from 'http';
import { controlServer } from './io';
import { readFile } from 'fs';
import url from 'url';
import { join } from 'path';

export default http.createServer(function(request, response) {
  const { pathname } = url.parse(request.url);

  if (request.method === 'POST' && pathname.includes('/errors')) {
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

  readFile(join('static', pathname), (error, data) => {
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
