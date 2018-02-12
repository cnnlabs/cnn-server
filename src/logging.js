const debug = require('debug')('cnn-server:logger');

const log = require('cnn-logger')(process.env.LOGZIO_TOKEN ? {
    console: {
        logLevel: (process.env.KUBERNETES_PORT ? 'fatal' : (process.env.CONSOLE_LOG_LEVEL || process.env.LOG_LEVEL))
    },
    logzio: {
        tags: [
            process.env.PRODUCT && process.env.PRODUCT,
            process.env.ENVIRONMENT && process.env.ENVIRONTMENT.toLowerCase() + '-env'
        ]
    }
} : {});

debug(`Initializing Logging subsystem... LOG_LEVEL="${process.env.LOG_LEVEL}", CONSOLE_LOG_LEVEL="${process.env.CONSOLE_LOG_LEVEL}"`);

log.silly('Running self check: silly');
log.debug('Running self check: debug');
log.verbose('Running self check: verbose');
log.info('Running self check: info');
log.warn('Running self check: warn');
log.error('Running self check: error');
log.fatal('Running self check: fatal');
log.important('Running self check: important');

module.exports = log;
