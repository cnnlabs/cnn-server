const http = require('http');
const express = require('express');
const reqId = require('express-request-id')();
const logger = require('cnn-logger');
const defaultConfig = require('./config');

function reqLogger(req, res, next) {
  req.log.info(`Request: ${req.id} ${req.method} ${req.originalUrl}`);
  res.on('finish', function() {
    req.profile.end = new Date();
    req.profile.duration = req.profile.end - req.profile.start;
    req.log.info(`Request: ${req.id} completed. Duration: ${req.profile.duration} ms`);
  });
  next();
}

class Server {
  constructor(config) {
    this.config = config || defaultConfig;
    this.log = logger(this.config.logging);
    this.app = express();
    this.app.use((req, res, next) => {
      req.profile = { start: new Date() };
      req.log = this.log;
      next();
    });
    this.app.disable('x-powered-by');
    this.app.use(reqId);
    this.app.use(reqLogger);
    this.service = null;
  }

  async start() {
    return new Promise((resolve, reject) => {
      if (this.service) {
        const err = new Error('Service already running');
        this.log.error(err);
        return reject(err);
      }
      if (process.env.NODE_ENV !== 'production') {
          this.log.warn(`Current NODE_ENV "${process.env.NODE_ENV}" !== "production". Performance will be degraded.`);
      }
      this.service = http.createServer(this.app);
      this.service.once('error', (err) => {
        if (err.errno === 'EADDRINUSE') {
          this.service = null;
          this.log.error(err);
          reject(err);
        }
      });
      this.service.listen(this.config.port, () => {
        this.log.info(`Service started on port ${this.config.port}`);
        resolve();
      });
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (this.service) {
        this.service.close(() => {
          this.service = null;
          this.log.info(`Service no longer listening on port ${this.config.port}`);
          return resolve();
        });
      } else {
        const err = new Error('Service not started');
        this.log.error(err);
        reject(err);
      }
    });
  }
}

module.exports = Server;
