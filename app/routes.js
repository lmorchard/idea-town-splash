module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      var d = require('./data/pages/index.js');
      console.log(d);
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
