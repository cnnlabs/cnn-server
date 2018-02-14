/**
 * Check NODE_ENV to see if it is set to a supported value.
 *
 * The NODE_ENV environment variable specifies the environment in which an
 * application is running (usually, development or production). One of the
 * simplest things you can do to improve performance is to set NODE_ENV to
 * “production.”
 *
 * @link https://expressjs.com/en/advanced/best-practice-performance.html
 *
 * @return {undefined}
 */
function checkNodeEnvironment() {
    // List of supported NODE_ENV values.
    const supported = ['production', 'development', 'staging', 'test'];
    // Check if a value is set and that it is supported.
    if (supported.indexOf(process.env.NODE_ENV) === -1) {
        log.important(`process.env.NODE_ENV of "${process.env.NODE_ENV}" is not supported - it should be one of: ${supported}`);
    }
}

module.exports = checkNodeEnvironment;
