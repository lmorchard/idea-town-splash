module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply.view('index', require('./data/pages/index.js'));
    },
    config: {
      id: 'index'
    }
  },
  // Public
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public/',
        listing: true,
        index: true
      }
    }
  }
];
