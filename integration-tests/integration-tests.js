const chai = require('chai');
const expect = chai.expect;
const aws = require('aws-sdk');

describe("integration-tests", () => {

    const table1 = 'Table1';
    const table2 = 'Table2';

    beforeEach(() => {
        initConfig();
    });


    it("verify table 1 created", done => {
        return verifyTableExists(table1, done);
    });

    it("verify data for key \"table1_1\" for table 1 created", done => {
        return verifyDataExistsForTable(table1, 'table1_1', '1_1', done);
    });

    it("verify data for key \"table1_2\" for table 1 created", done => {
        return verifyDataExistsForTable(table1, 'table1_2', '1_2', done);
    });

    it("verify table 2 created", done => {
        return verifyTableExists(table2, done);
    });

    it("verify data for key \"table2_1\" for table 2 created", done => {
        return verifyDataExistsForTable(table2, 'table2_1', '2_1', done);
    });

    it("verify data for key \"table2_2\" for table 1 created", done => {
        return verifyDataExistsForTable(table2, 'table2_2', '2_2', done);
    });

    let verifyDataExistsForTable = (table, key, value, done) => {
        let docClient = new aws.DynamoDB.DocumentClient({
            endpoint: getEndpoint()
        });
        return new Promise((resolve, reject) => {
            var params = {
                TableName: table,
                Key: {
                    hash_key: key
                }
            };
            docClient.get(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }                // successful response
            });
        })
            .then(data => {
                expect(data.Item.data).to.equal(value);
                done();
            });
    };

    let verifyTableExists = (name, done) => {

        let dynamodb = new aws.DynamoDB({
            endpoint: getEndpoint()
        });
        return new Promise((resolve, reject) => {
            let params = {
                TableName: name
            };

            dynamodb.describeTable(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }                // successful response
            });
        })
            .then(data => {
                expect(data.Table.TableName).to.equal(name);
                done();
            });
    };

    let getEndpoint = () => {
        return new aws.Endpoint('http://localhost:443');
    };

    let initConfig = () => {
        aws.config.update({
            accessKeyId: "fake-password-key",
            secretAccessKey: "fake-password-secret",
            region: "us-east-1"
        });
    };

});
