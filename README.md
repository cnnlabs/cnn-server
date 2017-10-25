# CNN Server

[![NPM Package](https://img.shields.io/npm/v/cnn-server.svg?style=flat-square)](https://www.npmjs.org/package/cnn-server)
[![Build Status](https://img.shields.io/travis/cnnlabs/cnn-server.svg?branch=master&style=flat-square)](https://travis-ci.org/cnnlabs/cnn-server)
[![Coverage Status](https://img.shields.io/coveralls/cnnlabs/cnn-server.svg?branch=master&style=flat-square)](https://coveralls.io/github/cnnlabs/cnn-server)
[![Greenkeeper badge](https://badges.greenkeeper.io/cnnlabs/cnn-server.svg)](https://greenkeeper.io/)

CNN Server is an express server that is preconfigured with [CNN Messaging](https://github.com/cnnlabs/cnn-messaging) and [CNN Logger](https://github.com/cnnlabs/cnn-logger).

CNN Server is also a javascript class that can be extended to add additional functionality.

Example:

```
const config = {
  port: 5050,
  logger: {
    console: {
      logLevel: 'important'
    }
  },
  messenger: {
    amqp: {
      connectionString: 'amqp://localhost:5672',
      exchangeName: 'MOCHA_TEST'
    }
  }
};
const Server = require('cnn-server');

const server = new Server(config);
const someMiddleware = require('some-middleware');

server.app.use(someMiddleware) //use whatever middleware you like

server.app.get('/', (req, res) => {
    // requests have an id by default for tracing through multiple services (also set as header)
    // can access logger directly from request object (no global required)
    req.log.info(req.id);

    // can access Message class directly from req
    const message = new req.Message({
        context: {
            systemId: mySystemName,
            environment: myEnvironmentName,
            model: myModelName,
            objectId: 1234567890,
            action: insert
        },
        event: { // can be any object
            some: 'thing'
        }
    })

    // can access instantiated messenger directly from req
    req.messenger.publish(message);
    res.send('hello world');  
});

// start and stop are both promises and support async/await
server.start();
```
