var data = require('./data.json');
data.pkgVer = require('../package.json').version;

module.exports = {
  index: function(req, res){
    res.render('index', data);
  },
  signup: require('./signup')
};
