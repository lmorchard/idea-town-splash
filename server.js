var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 3000 });

// Views
server.views({
  engines: {
      html: require('jade'),
  },
  isCached: 'false',
  context: require('./app/data/default_context'),
  layout: 'layout',
  layoutPath: './app/views/layout',
  path: './app/views'
});

// Routes
server.route(require('./app/routes'));

// 404 Handling
server.ext('onPreResponse', function (request, reply) {

  if (request.response.isBoom) {
    return reply.view('splash', require('./data/pages/404.js'));
  }

  return reply.continue();
});

//Plugins
server.register([
  {
    register: require('hapi-named-routes')
  }
], function() {

//Start The Server
  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});
