const os = require('os');
const cluster = require('cluster');
const http = require('http');
const express = require('express');
const debug = require('debug')('cnn-server:express');
const compression = require('compression');
const { healthcheckRoute } = require('./healthcheck.js');
const { handleNoMatch, handleError } = require('./errors.js');

function start(app, config) {
    if (process.env.ENABLE_CLUSTER && cluster.isMaster) {
        os.cpus().forEach(c => cluster.fork());
        cluster.on('exit', function fork(worker) {
            log.error(`Worker ${worker.id} died.`);
            cluster.fork();
        });
    } else {
        const { port } = config;
        http.createServer(app).listen(port, function start() {
            log.important(`Service started on port: ${port}`);
        });
    }
}

function handleErrors(app, callback) {
    // Default route to 404 unmatched things.
    app.all('*', handleNoMatch);
    // Error handler
    app.use(handleError);
    callback();
}

function registerRoutes(app, { routes : r }, callback) {
    const routes = r.slice();

    routes.unshift(healthcheckRoute);

    routes.forEach(({ method = 'get', path, handler }) => {
        debug(`Registering route: path: ${path}, method: ${method}`);
        app[method.toLowerCase()].call(app, path, handler);
    });

    callback();
}

function registerMiddleware(app, express, config, callback) {
    const {
      middleware,
      enableCompression,
      enableStatic,
      staticPath,
      staticDirectory
    } = config;

    middleware.forEach(middleware => {
        if (typeof middleware === 'function') {
            debug(`Registering middleware: ${middleware.name}`);
            app.use.call(app, middleware);
        } else {
            const { path = '/', handler } = middleware;
            debug(`Registering middleware: ${path}`);
            app.use.call(app, path, handler);
        }
    });

    enableCompression && app.use(compression());
    enableStatic && app.use(staticPath, express.static(staticDirectory));

    callback();
}

function handleEscapeHatch(escapeHatch, app, express, callback) {
    escapeHatch && escapeHatch(app, express);
    callback();
}

function server(config, escapeHatch = null) {
    const app = express();
    app.disable('x-powered-by');
    const step5 = start.bind(null, app, config);
    const step4 = handleErrors.bind(null, app, step5);
    const step3 = registerRoutes.bind(null, app, config, step4);
    const step2 = registerMiddleware.bind(null, app, express, config, step3);
    const step1 = handleEscapeHatch.bind(null, escapeHatch, app, express, step2);

    step1();
}

module.exports = server;
