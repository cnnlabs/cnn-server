# CNN Server

TODO... Until then, check out `example.js`.

## Supported Environment Variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `PORT`   | Port for application to listen on. | `5050` |
| `ENABLE_COMPRESSION` | Enables `compression` middleware. | `false` |
| `ENABLE_STATIC` | Enables ability to serve static assets. | `false` |
| `ENABLE_CLUSTER` | Turns on clustering, forking to available cores. | `false` |
| `LOGZIO_TOKEN` | Used for logz.io transport (REQUIRED for logging to logz.io) | none |
| `PRODUCT` | Your product's name (REQUIRED for logging to logz.io) | none |
| `ENGIRONMENT` | Environment your product runs in (REQUIRED for logging to logz.io) | none |
| `LOG_LEVEL` | Log level used for logz.io and as a fallback for stdout | `important` |
| `CONSOLE_LOG_LEVEL` | Log level used for stdout | `important` |
