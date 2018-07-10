function notifySuccess(app, callback) {
    typeof callback === 'function' && callback(null, { app });
}

function start(app, { port, hostname }, callback) {
    app.start((err) => {
        if (err) { throw err; }
        log.important(`Service started on port: ${port}`);
        callback();
    });
}

function registerRoutes(app, { routes : r }, callback) {
    const { healthcheckRoute } = require('./healthcheck.js');
    const routes = r.slice();

    routes.unshift(healthcheckRoute);

    routes.forEach(({ method = 'GET', path, ...rest }) => {
        log.info(`Registering route: path: ${path}, method: ${method}`);
        app.route({ method: method.toUpperCase(), path, ...rest })
    });

    callback();
}

function registerPlugins(app, { plugins : p }, callback) {
    const plugins = p.slice();
    const promises = [];

    plugins.forEach(({ register, options },index,array) => {
        let pluginName =
          (register.register.attributes.pkg !== undefined) ? register.register.attributes.pkg.name : register.register.attributes.name;
        log.info(`Registering plugin: ${pluginName}`);
        // In hapi 16, calling register without a callback will return a promise
        // In hapi 17, this is not true
        promises.push(app.register({ register : register, options : options}));
    });

    Promise.all(promises)
        .then(() => {
            callback();
        })
        .catch((err) => {
            log.error('Failed to load plugin: ', err);
            throw err;
        });
}

function server(config, escapeHatch = null, callback = null) {

    const Hapi = require('hapi');
    const app = new Hapi.Server();

    app.connection({ port: config.port, host: config.hostname });

    const step4 = notifySuccess.bind(null, app, callback);
    const step3 = start.bind(null, app, config, step4);
    const step2 = registerPlugins.bind(null, app, config, step3);
    const step1 = registerRoutes.bind(null, app, config, step2);

    step1();
}

module.exports = server;
