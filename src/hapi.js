function start(app, { port, hostname }) {
    app.start((err) => {
        if (err) { throw err; }
        log.important(`Service started on port: ${port}`);
    });
}

function registerRoutes(app, { routes : r }, callback) {
    const { healthcheckRoute } = require('./healthcheck.js');
    const routes = r.slice();

    routes.unshift(healthcheckRoute);

    routes.forEach(({ method = 'GET', path, handler }) => {
        log.info(`Registering route: path: ${path}, method: ${method}`);
        app.route({ method: method.toUpperCase(), path, handler })
    });

    callback();
}

function registerPlugins(app, { plugins : p = [] }, callback) {
    const plugins = p.slice();

    if (!plugins.length) {
      callback();
    }
    plugins.forEach(({ register, options },index,array) => {
        let pluginName =
          (register.register.attributes.pkg !== undefined) ? register.register.attributes.pkg.name : register.register.attributes.name;
        log.info(`Registering plugin: ${pluginName}`);

        if (index === (array.length-1)) {
          app.register({ register : register, options : options},(err) => {
            if (err) {
              log.error('Failed to load plugin:', err);

              throw err;
            }

            callback();
          });
        }
        else {
          app.register({ register : register, options : options}, (err) => {
            if (err) {
              log.error('Failed to load plugin:', err);

              throw err;
            }
          });
        }
    });
}

function server(config, escapeHatch = null) {

    const Hapi = require('hapi');
    const app = new Hapi.Server();

    app.connection({ port: config.port, host: config.hostname });

    const step3 = start.bind(null, app, config);
    const step2 = registerPlugins.bind(null,app, config, step3);
    const step1 = registerRoutes.bind(null, app, config, step2);

    step1();
}

module.exports = server;
