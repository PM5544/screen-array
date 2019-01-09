import http from 'http';
import { controlServer } from './io';
import { readFile } from 'fs';
import { parse as parseURL } from 'url';
import { join } from 'path';

export default http.createServer(function(request, response) {
  const { url } = request;

  if (request.method === 'POST' && url.includes('/errors')) {
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

  const fileName = '/' === url ? 'index.html' : parseURL(url).pathname;

  readFile(join('static', fileName), (error, data) => {
    if (error) {
      response.writeHead(404);
    } else {
      if (fileName.endsWith('.css')) {
        response.writeHead(200, { 'Content-Type': 'text/css' });
      } else if (fileName.endsWith('.html')) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
      } else if (fileName.endsWith('.mjs') || fileName.endsWith('.js')) {
        response.writeHead(200, { 'Content-Type': 'application/javascript' });
      }
      response.write(data, 'utf8');
    }
    response.end();
  });
});
