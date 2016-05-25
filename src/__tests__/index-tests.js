'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');

const SeedDynamo = require('../seed-dynamo');
const commands = require('../docker-commands');
const InitializationType = require('../initialization-type').InitializationType;

describe('index exports', () => {

    let sinon;
    let _isSeedDynamo;
    let _isStartDynamo;
    let _savedChanges;
    let _pushed;

    beforeEach(() => {
        _isSeedDynamo = false;
        _isStartDynamo = false;
        _savedChanges = false;
        _pushed = false;
        sinon = globalSinon.sandbox.create();

        sinon.stub(SeedDynamo, 'SeedDynamo', () => {
            _isSeedDynamo = true;
        });

        sinon.stub(commands, 'StartDynamo', () => {
            _isStartDynamo = true;
        });

        sinon.stub(commands, 'SaveChanges', () => {
            _savedChanges = true;
        });

        sinon.stub(commands, 'Push', () => {
            _pushed = true;
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

    it("exports SaveChanges", () => {
        getIndex().SaveChanges();

        expect(_savedChanges).to.equal(true);
    });

    it("exports SaveChanges", () => {
        getIndex().Push();

        expect(_pushed).to.equal(true);
    });

    it("exports InitializationType", () => {
        expect(getIndex().InitializationType).to.equal(InitializationType);
    });

    let getIndex = () => require('../index');

});