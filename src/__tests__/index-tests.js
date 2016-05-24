'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');

const SeedDynamo = require('../seed-dynamo');
const StartDynamo = require('../start-dynamo');
const InitializationType = require('../dynamo-initialization-type').InitializationType;

describe('index exports', () => {

    let sinon;
    let _isSeedDynamo;
    let _isStartDynamo;


    beforeEach(() => {
        _isSeedDynamo = false;
        _isStartDynamo = false;
        sinon = globalSinon.sandbox.create();

        sinon.stub(SeedDynamo, 'SeedDynamo', () => {
            _isSeedDynamo = true;
        });

        sinon.stub(StartDynamo, 'StartDynamo', () => {
            _isStartDynamo = true;
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("exports StartDynamo", () => {
        getIndex().StartDynamo();

        expect(_isStartDynamo).to.equal(true);
    });

    it("exports SeedDynamo", () => {
        getIndex().SeedDynamo();

        expect(_isSeedDynamo).to.equal(true);
    });

    it("exports InitializationType", () => {
        expect(getIndex().InitializationType).to.equal(InitializationType);
    });

    let getIndex = () => require('../index');

});