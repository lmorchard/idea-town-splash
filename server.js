var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 3001 });

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
