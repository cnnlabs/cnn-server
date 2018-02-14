const server = require('./src/index.js');

// To test: `$ node example.js`
//
// Comment / uncomment the various examples below to test different invocations.
// View examples at: localhost:PORT/
//
// NOTE:
// - Express is the default framework
// - /_healthcheck is the only route added by default


// Using default configuration values
// -----------------------------------------------------------------------------
// server();


// Using a different port
// -----------------------------------------------------------------------------
// process.env.PORT = 5000
// server();
//
// - or -
//

// Fun with frameworks
// -----------------------------------------------------------------------------
// function send(handler, response) {
//     (handler && handler.send) ? handler.send(response) : handler(response);
// }

// const frameworks = ['hapi', 'express'];

// // simple plugin based on tutorial, https://hapijs.com/tutorials/plugins
// const myHapiPlugin = {
//     register: function (server, options, next) {
//       log.important(`myHapiPlugin options, Port ${server.info.port}: `,options);
//       server.route({
//         method: 'GET',
//         path: '/myHapiPluginOptions',
//         handler: function (request, reply) {
//             reply({ myHapiPluginOptions : options});
//         }
//       });
//       next();
//     }
// };

// myHapiPlugin.register.attributes = {
//     name: 'myHapiPlugin',
//     version: '1.0.0'
// };

// const myHapiPluginOptions = [{ foo : 'bar'},{ bar : 'foo'},{ foobar : true}];

// for (let port = 5000; port < 5005; port++) {
//     const framework = frameworks[Math.floor(Math.random() * frameworks.length)];
//     server({
//         port,
//         framework,
//         routes: [ { path: '/foo', handler: (req, res) => send(res, framework) } ],
//         plugins: [ { register: myHapiPlugin, options: myHapiPluginOptions[Math.floor(Math.random() * myHapiPluginOptions.length)] }]
//     });
// }

// Define a route
// -----------------------------------------------------------------------------
server({
    routes: [
        {
            path: '/foo',
            handler: (req, res) => res.json({ foo: 'Hello World!' })
        }
    ]
});

// Bypass (some) configuration and use escape hatch
// -----------------------------------------------------------------------------
// server({}, (app, express) => {
//     app.get('/bar', (req, res) => res.json({ bar: 'Hello World!' }));
// });
