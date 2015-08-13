var Busboy = require('busboy');
var config = require('../app_config.json');
var db = require('../lib/db');

module.exports = function(req, res) {
  try {
    var busboy = new Busboy({headers: req.headers});
    busboy.on('field', function(fieldname, val) {
      if (fieldname === 'email') {
        signup(req, res, val);
      } else {
        res.sendStatus(400);
      }
    }).on('error', function(err) {
      sendErr(req, res, err);
    });
    req.pipe(busboy);
  }
  catch (err) {
    sendErr(req, res, err);
  }
};

function signup(req, res, emailSubmitted) {
  var formData = {
    TableName: config.STARTUP_SIGNUP_TABLE,
    Item: {
      email: {'S': emailSubmitted}
    }
  };
  db.putItem(formData, function(err) {
    if (err) {
      sendErr(req, res, err);
    } else {
      sendSuccess(req, res);
    }
  });
}

function sendErr(req, res, err) {
  console.error(err);
  res.sendStatus(500);
}

function sendSuccess(req, res) {
  res.sendStatus(200);
}
