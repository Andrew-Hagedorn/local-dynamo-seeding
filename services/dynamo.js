var aws = require('aws-sdk');
var Promise = require('bluebird');
var promiseRunner = require('./run-for-all');

var getEndpoint = function() {
    return new aws.Endpoint('http://localhost:8000');
};

var initConfig = function() {
    aws.config.update({
        accessKeyId: "fake-password-key",
        secretAccessKey: "fake-password-secret",
        region: "us-east-1"
    });
};

var putItem = function(update) {

    initConfig();
    var docClient = new aws.DynamoDB.DocumentClient({
        endpoint: getEndpoint()
    });

    return new Promise(function(resolve, reject) {
        docClient.put(update, function(err, data) {
            if (err) {
                reject(err);
            } else {
                console.log("Created data for: " + update.TableName);
                resolve(update);
            }
        });
    });
};

exports.createTable = function(definition) {

    initConfig();
    var dynamo = new aws.DynamoDB({
        endpoint: getEndpoint()
    });

    return new Promise(function(resolve, reject) {
        dynamo.createTable(definition.table_params, function(err) {
            if (err) {
                reject(err);
            } else {
                console.log("Created table: " + definition.table_params.TableName);
                resolve(definition);
            }
        });
    });
};

exports.initializeData = function(definition) {
    return promiseRunner.runForAll(definition.updates, putItem);
};