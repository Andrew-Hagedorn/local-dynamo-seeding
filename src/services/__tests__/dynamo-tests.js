'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');
import { default as Db } from '../../wrappers/db';
import { default as DynamoDb } from '../dynamo';

describe('dynamo', () => {

    let _params;
    let _error;
    let _definition;
    let sinon;

    beforeEach(() => {
        _error = null;
        _params = null;
        _definition = {
            table_params: {
                TableName : "Asdf"
            },
            updates: [
                { update: 1 },
                { update: 2 }
            ]
        };

        sinon = globalSinon.sandbox.create();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createTable', () => {

        beforeEach(() => {

            sinon.stub(Db.prototype, 'createTable', (params, cb) => {
                _params = params;
                cb(_error);
            })
        });

        it('given an error, rejects the promise', done => {
            givenError();

            createTable()
                .then(() => {
                    assert.fail("The error should have been thrown");
                })
                .catch(err => {
                    expect(err).to.equal(_error);
                    done();
                });
        });

        it('creates the table with the table parameters', done => {
            return createTable()
                .then(() => {
                    expect(_params).to.equal(_definition.table_params);
                    done();
                });
        });

        it('returns the definition', done => {
            return createTable()
                .then(result => {
                    expect(result).to.equal(_definition);
                    done();
                });
        });

        let createTable = () => {
            return getDynamoDb().createTable(_definition);
        };
    });

    describe('initializeData', () => {

        let _updateArray;

        beforeEach(() => {
            _updateArray = [];
            sinon.stub(Db.prototype, 'put', (update, callback) => {
                _updateArray.push(update);
                callback(_error);
            });
        });

        it('given an error, rejects the promise', done => {
            givenError();

            initializeData()
                .then(() => {
                    assert.fail("The error should have been thrown");
                })
                .catch(err => {
                    expect(err).to.equal(_error);
                    done();
                });
        });

        it('Adds each piece of data to dynamo', done => {
            return initializeData()
                .then(() => {
                    expect(_updateArray.length).to.equal(2);
                    expect(_updateArray[0].update).to.equal(1);
                    expect(_updateArray[1].update).to.equal(2);
                    done();
                });
        });

        it('returns an array with each update', done => {
            return initializeData()
                .then(result => {
                    expect(result.length).to.equal(2);
                    expect(result[0].update).to.equal(1);
                    expect(result[1].update).to.equal(2);
                    done();
                });
        });

        let initializeData = () => getDynamoDb().initializeData(_definition);
    });

    let getDynamoDb = () => new DynamoDb();
    
    let givenError = () => {
        _error = { message: "errored"}
    };
});