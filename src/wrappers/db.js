const aws = require('aws-sdk');

const getEndpoint = () => {
    return new aws.Endpoint('http://localhost:8000');
};

const initConfig = () => {
    aws.config.update({
        accessKeyId: "fake-password-key",
        secretAccessKey: "fake-password-secret",
        region: "us-east-1"
    });
};


export default class Db {

    createTable(params, callback) {

        initConfig();

        var dynamo = new aws.DynamoDB({
            endpoint: getEndpoint()
        });

        return dynamo.createTable(params, callback);
    }

    put(update, callback) {

        initConfig();

        var docClient = new aws.DynamoDB.DocumentClient({
            endpoint: getEndpoint()
        });

        return docClient.put(update, callback);

    }
};