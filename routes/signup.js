var Busboy = require('busboy');
var config = require('../app_config.json');
var db = require('../lib/db');

module.exports = function(req, res) {
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
};

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
