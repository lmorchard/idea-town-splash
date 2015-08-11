/**
 * Simply dumps out the email column from the 
 * dynamo db table, one per line
 */

const LIMIT = undefined; // undefined || <integer>, emails to fetch/req

var region = process.argv[2],
    table  = process.argv[3],
    AWS = require('aws-sdk'), 
    dyn = new AWS.DynamoDB({region: region});

function getAll(dyn, tableName, lastKey) {
    var params = {
        TableName: table, 
        Limit: LIMIT,
        ExclusiveStartKey: lastKey
    };

    dyn.scan(params, function(err, data) {
        if (err) {
            console.log(err);
            return
        } else {

            data.Items.forEach(function(v, i) {
                console.log(v.email.S);
            });

            /* keep fetching documents until there are no more */
            if (data.LastEvaluatedKey != null) {
                getAll(dyn, tableName, data.LastEvaluatedKey)
            }
        }
    });
}

getAll(dyn, table, null);
