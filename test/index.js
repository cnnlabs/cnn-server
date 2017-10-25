const Server = require('../src/index');
const request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
chai.should();

describe('cnn-server start and stop', function() {
  const server = new Server({
    port: 5050,
    logger: {
      console: {
        logLevel: 'important'
      }
    }
  });

  it('should start with an asynchronous start function', function() {
    return server.start();
  });

  it('should not start if already started', function() {
    return new Promise((resolve, reject) => {
      return server.start()
        .then(reject)
        .catch(resolve);
    });
  });

  it('should stop with an asynchronous stop function', function() {
    return server.stop();
  });

  it('should not stop if not running', function() {
    return new Promise((resolve, reject) => {
      return server.stop()
        .then(reject)
        .catch(resolve)
    });
  });

  it('should return a rejected promise when EADDRINUSE', function() {
    const express = require('express');
    const app = express();
    const service = app.listen(5050);
    return new Promise((resolve, reject) => {
      return server.start()
        .then(reject)
        .catch(() => {
          service.close(resolve);
        });
    });
  });

});

describe('cnn-server features', function() {
  const server = new Server({
    port: 5050,
    logging: {
      console: {
        logLevel: 'info'
      }
    }
  });

  server.app.get('/', function(req, res) {
    res.cookie('cookie', 'hey');
    res.send();
  });

  before(() => {
    sinon.spy(server.log, "info");
    return server.start();
  });

  after(() => {
    return server.stop();
  });

  it('should log requests using cnn-logger', function() {
    return request(server.app)
      .get('/')
      .expect(200)
      .then((res) => {
        server.log.info.calledWith(`Request: ${res.headers['x-request-id']} GET /`).should.be.true;
      });
  });
});
