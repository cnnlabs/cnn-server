const express = require('express');
const reqId = require('express-request-id')();

function log(req, res, next) {
  console.log('log', req.id);
  console.log(req.method, req.url, JSON.stringify(req.headers));
  next();
}

function profile(req, res, next) {
  console.log('profile', req.id);
  next();
}

const app = express();
app.use(reqId);
app.use(log);
app.use(profile);

module.exports = app;
