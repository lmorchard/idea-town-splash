module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(request,reply) {
      reply.view('splash', require('./data/pages/splash.js'));
    },
    config: {
      id: 'splash'
    }
  },

  {
    method: 'GET',
    path: '/home',
    handler: function(request,reply) {
      reply.view('splash', require('./data/pages/home.js'));
    },
    config: {
      id: 'home'
    }
  },

  {
    method: 'GET',
    path: '/faq',
    handler: function(request,reply) {
      reply.view('splash', require('./data/pages/faq.js'));
    },
    config: {
      id: 'faq'
    }
  },

  {
    method: 'GET',
    path: '/privacy',
    handler: function(request,reply) {
      reply.view('splash', require('./data/pages/privacy.js'));
    },
    config: {
      id: 'privacy'
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
