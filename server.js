var http = require('http');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var helmet = require('helmet');

var routes = require('./routes');
var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(helmet());
app.use(morgan('combined'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/media', serveStatic(path.join(__dirname, 'public/vendor/mozilla-tabzilla/media')));

app.get('/', routes.index);
app.post('/signup', routes.signup);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
