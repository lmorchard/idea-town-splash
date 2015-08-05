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

var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();

app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use('/media', serveStatic(path.join(__dirname, 'public/vendor/mozilla-tabzilla/media')));

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);
AWS.config.update(config);

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({region: config.AWS_REGION});
//Create SNS client and pass in region.
var sns = new AWS.SNS({ region: config.AWS_REGION});

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
      var snsMessage = 'New signup: %EMAIL%'; //Send SNS notification containing email from form.
      snsMessage = snsMessage.replace('%EMAIL%', formData.Item.email['S']);
      sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, Message: snsMessage }, function(err) {
        if (err) {
          console.log('Error publishing SNS message: ' + err);
        } else {
          console.log('SNS message sent.');
        }
      });
    }
  });
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
