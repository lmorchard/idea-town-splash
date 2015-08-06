var AWS = require('aws-sdk');
var xtend = require('xtend');
var config = xtend(require('../app_config.json'), {
  'accessKeyId': process.env.ACCESS_KEY_ID,
  'secretAccessKey': process.env.SECRET_ACCESS_KEY
});

AWS.config.update(config);
module.exports = new AWS.DynamoDB({region: config.AWS_REGION});
