module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: require('./controllers/index')
    }
  },
  {
    method: 'GET',
    path: '/splash',
    handler: function(request,reply) {
      reply.view('splash');
    }
  },
  // Public
  {
    method: 'GET',
    path: '/{param*}',
    config: {
      auth: false,
      handler: require('./controllers/assets')
    }
  },
  {
    method: 'GET',
    path: '/{path*}',
    handler: function(request,reply) {
      reply.view('404');
    }
  }
];
