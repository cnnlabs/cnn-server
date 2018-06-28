global.log = require('./logging.js');
const debug = require('debug')('cnn-server:init');
const checkNodeEnvironment = require('./check-node-environment.js');

function server(appConfig, escapeHatch = null, callback = null) {
    const baseConfig = require('./config.js');
    const config = Object.assign({}, baseConfig, appConfig);

    debug('merged configuration: ', config);

    checkNodeEnvironment();

    switch (config.framework) {
        case 'hapi':
            debug('Using Hapi framework');
            require('./hapi.js')(config, escapeHatch, callback);
            break;
        case 'express':
            debug('Using Express framework');
            require('./express.js')(config, escapeHatch, callback);
            break;
        default:
            throw new Error(`Unsupported framework: ${config.framework}`);
    }
}

module.exports = server;
