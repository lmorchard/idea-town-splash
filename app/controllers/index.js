module.exports = function(request, reply) {

  reply.view('index', require('../data/index.js'));

};
