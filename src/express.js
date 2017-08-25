function start(app, config) {
    const { port } = config;
    const http = require('http');
    http.createServer(app).listen(port, () => {
        log.important(`Service started on port: ${port}`);
    });
    // @TODO: Add error check
    // @TODO: Add support for https
}

function handleErrors(app, callback) {
    const { handleNoMatch, handleError } = require('./errors.js');
    // Default route to 404 unmatched things.
    app.all('*', handleNoMatch);
    // Error handler
    app.use(handleError);
    callback();
}

function registerRoutes(app, { routes : r }, callback) {
    const { healthcheckRoute } = require('./healthcheck.js');
    const routes = r.slice();

    routes.unshift(healthcheckRoute);

    routes.forEach(({ method = 'get', path, handler }) => {
        log.info(`Registering route: path: ${path}, method: ${method}`);
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
            log.important(`Registering middleware: ${middleware.name}`);
            app.use.call(app, middleware);
        } else {
            const { path = '/', handler } = middleware;
            log.important(`Registering middleware: ${path}`);
            app.use.call(app, path, handler);
        }
    });

    enableCompression && app.use(require('compression')());
    enableStatic && app.use(staticPath, express.static(staticDirectory));

    callback();
}

function handleEscapeHatch(escapeHatch, app, express, callback) {
    escapeHatch && escapeHatch(app, express);
    callback();
}

function server(config, escapeHatch = null) {

    const express = require('express');
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
