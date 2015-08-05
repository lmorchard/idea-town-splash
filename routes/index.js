var data = require('./data.json');
data.pkgVer = require('../package.json').version;

exports.index = function(req, res){
  res.render('index', data);
};
