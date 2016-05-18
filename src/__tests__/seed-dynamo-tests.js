'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');
import { SeedDynamo } from '../seed-dynamo';
const tableDefinitions = require('../services/table-definitions');
import DynamoDb  from '../services/dynamo';
const runForAll = require('../services/run-for-all');

describe('seed-dynamo', () => {

    const directory = "../table_directory";
    const initialize = "initializeData";
    const create = "createTable";

    let sinon;
    let _runForAllArray;
    let _definition;
    let _directory;

    let initVariables = () => {
        _runForAllArray = [];
        _definition = {
            info: "table information"
        };
        _directory = null;
        sinon = globalSinon.sandbox.create();
    };

    beforeEach(() => {

        initVariables();

        sinon.stub(runForAll, 'default', (def, func) => {
            _runForAllArray.push({ def, func });
            return new Promise(resolve => {
                resolve(def);
            });
        });

        sinon.stub(tableDefinitions, 'default', (directory) => {
            _directory = directory;
            return new Promise(resolve => {
                resolve(_definition);
            });
        });

        sinon.stub(DynamoDb.prototype, 'createTable', () => create);
        sinon.stub(DynamoDb.prototype, 'initializeData', () => initialize);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("gets table definitions from the provided directory", done =>
        seedDynamo()
            .then(() => {
                expect(_directory).to.equal(directory);
                done();
            })
    );

    it("runs create table for the table definitions", done =>
        seedDynamo()
            .then(() => {
                verifyTableCreated();
                done();
            })
    );

    it("runs initializeData for the table definitions", done =>

        seedDynamo()
            .then(() => {
                verifyDataInitialized();
                done();
            })

    );

    let seedDynamo = () => SeedDynamo(directory);

    let verifyDataInitialized = () => {
        expect(_runForAllArray[1].func()).to.equal(initialize)
    };

    let verifyTableCreated = () => {
        expect(_runForAllArray[0].func()).to.equal(create);
    };

});