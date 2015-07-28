module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply.view('home', require('./data/pages/home.js'));
    },
    config: {
      id: 'home'
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
