//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License").
//You may not use this file except in compliance with the License.
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
//either express or implied. See the License for the specific language
//governing permissions and limitations under the License.

//Get modules.
var express = require('express');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var Busboy = require('busboy');
var helmet = require('helmet');

var routes = require('./routes');
var http = require('http');
var path = require('path');
var AWS = require('aws-sdk');
var xtend = require('xtend');
var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(helmet());
app.use(morgan('combined'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/media', serveStatic(path.join(__dirname, 'public/vendor/mozilla-tabzilla/media')));

var config = xtend(require('./app_config.json'), {
  'accessKeyId': process.env.ACCESS_KEY_ID,
  'secretAccessKey': process.env.SECRET_ACCESS_KEY
});

AWS.config.update(config);

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({region: config.AWS_REGION});

app.get('/', routes.index);

app.post('/signup', function(req, res) {
  try {
    var busboy = new Busboy({headers: req.headers});
    busboy.on('field', function(fieldname, val) {
      if (fieldname === 'email') {
        signup(val);
      }
    });
    busboy.on('finish', function() {
      res.sendStatus(200);
    });
    req.pipe(busboy);
  }
  catch (err) {
    res.sendStatus(500);
  }
});

function signup(emailSubmitted) {
  var formData = {
    TableName: config.STARTUP_SIGNUP_TABLE,
    Item: {
      email: {'S': emailSubmitted}
    }
  };
  db.putItem(formData, function(err) {
    if (err) {
      console.log('Error adding item to database: ', err);
    } else {
      console.log('Form data added to database.');
    }
  });
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
