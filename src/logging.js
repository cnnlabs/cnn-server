const debug = require('debug')('cnn-server:logger');

function generateTags(LOGZIO_TAGS) {
    if (!LOGZIO_TAGS) {
        console.error('No LOGZIO_TAGS have been defined.');
        return null;
    }
    return LOGZIO_TAGS.split(',').map(i => i.trim()).filter(Boolean)
}

const log = require('cnn-logger')(process.env.LOGZIO_TOKEN ? {
    console: {
        logLevel: (process.env.KUBERNETES_PORT ? 'fatal' : (process.env.CONSOLE_LOG_LEVEL || process.env.LOG_LEVEL))
    },
    logzio: {
        tags: generateTags(process.env.LOGZIO_TAGS)
    }
} : {});

if (process.env.LOGZIO_TOKEN && !process.env.LOGZIO_TAGS) {
    log.important('process.env.LOGZIO_TAGS is not defined, your logs will not be sent to logz.io. See cnn-server README.');
}

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
