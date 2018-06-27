let errorCodes = require('http').STATUS_CODES;

if(String(process.env.ENABLE_HTTP2).toLowerCase() === 'true') {
    errorCodes = require('http2').STATUS_CODES;
}

/**
 * Utility function to return default error text for a specific error code
 *
 * @function
 * @private
 * @param {number} code - The error code to use
 * @returns {string} - The error message for the given code
 */
function getErrorMessage(code) {
    return code && errorCodes[code] || 'Unknown';
}

/**
 * HttpError Object constructor
 *
 * @constructor
 * @memberof http-error
 * @param {string|number} message - Error message, or error status code (if number).
 * @param {number} [status] - Error status code (if not set with message).
 */
function HttpError(message, status) {
    var lpart = (new Error()).stack.match(/[^\s]+$/);

    if (typeof message === 'number') {
        status = message;
        message = undefined;
    } else if (typeof status === 'number' || Number(status) > 0) {
        status = Number(status);
    } else if (typeof message === 'string' && (status = parseInt(message, 10)) > 0) {
        message = (message.length > 3) ? message : undefined;
    }
    this.statusCode = (status > 0 && status < 600) ? status : 500;
    this.message = (typeof message === 'string') ? message : getErrorMessage(this.statusCode);
    this.stack = `${this.name} at ${lpart}`;
}

Object.setPrototypeOf(HttpError, Error);
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.name = 'HttpError';
HttpError.prototype.message = '';
HttpError.prototype.statusCode = 0;
HttpError.prototype.constructor = HttpError;

module.exports = HttpError;
