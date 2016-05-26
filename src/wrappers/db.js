const aws = require('aws-sdk');

const getEndpoint = (port) => {
    return new aws.Endpoint('http://localhost:' + port);
};

const initConfig = () => {
    aws.config.update({
        accessKeyId: "fake-password-key",
        secretAccessKey: "fake-password-secret",
        region: "us-east-1"
    });
};

export default class Db {

    constructor(port) {
        this.port = port;
    }

    createTable(params, callback) {

        initConfig();

        var dynamo = new aws.DynamoDB({
            endpoint: getEndpoint(this.port)
        });

        return dynamo.createTable(params, callback);
    }

    put(update, callback) {

        initConfig();

        var docClient = new aws.DynamoDB.DocumentClient({
            endpoint: getEndpoint(this.port)
        });

        return docClient.put(update, callback);

    }
};