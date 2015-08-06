var http = require('http');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var helmet = require('helmet');
var favicon = require('serve-favicon');

var routes = require('./routes');
var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(helmet());
app.use(morgan('combined'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/media', serveStatic(path.join(__dirname, 'public/vendor/mozilla-tabzilla/media')));

//set the favicon, don't cache in dev, cache for a year in prod
app.use(favicon(__dirname + '/public/images/favicon.ico', {
  maxAge: (process.env.NODE_ENV === 'development') ? 0 : (1000 * 60 * 60 * 24 * 365)
}));

app.get('/', routes.index);
app.post('/signup', routes.signup);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
