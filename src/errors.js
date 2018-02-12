const HttpError = require('./http-error.js');

function handleNoMatch(req, res, next) {
    log.error(`Hit handleNoMatch middleware for ${req.url}`);
    next(new HttpError(`No match found for ${req.url}.`, 404));
}

function handleError(err, req, res, next) {
    const code = err.statusCode || 500;
    const message = err.message || 'Here be dragons.';
    log.fatal(`Sent error ${code} response for URI ${req.url}`);
    res.status(code).send(message);
}

module.exports = {
    handleNoMatch,
    handleError
};
