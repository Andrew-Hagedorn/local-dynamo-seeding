'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const fs = require('fs');
import { default as getTableDefinitions } from '../table-definitions';
import { default as wrappedRequire } from '../../wrappers/require';

describe('table-definitions', () => {

    const file1 = "file1";
    const file2 = "file2";

    let _error;
    let _files;
    let _dir;
    let sandbox;

    beforeEach(() => {

        sandbox = sinon.sandbox.create();
        _error = null;
        _dir = null;

        _files = [ file1, file2 ];

        sandbox.stub(wrappedRequire.prototype, 'wrappedRequire', file => {

            if(file == '../tables/file1'
                || file == '../tables/file2') {
                return {
                    table_def: file
                };
            }

            return null;
        });

        sandbox.stub(fs, 'readdir', (dir, cb) => {
            _dir = dir;
            cb(_error, _files);
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('given an error, returns a rejected promise', done => {

        givenError();

        tableDefinitions()
            .then(() => {
                assert.fail("A file error should have thrown");
            })
            .catch(err => {
                expect(err).to.equal(_error);
                done();
            });
    });

    it('reads the table defintions from the "./tables" directory', done => {

        return tableDefinitions()
            .then(defs => {

                expect(defs.length).to.equal(2);
                expect(defs[0].table_def).to.equal('../tables/file1');
                expect(defs[1].table_def).to.equal('../tables/file2');
                done();
            })

    });

    it('returns all table definitions', done => {

        return tableDefinitions()
            .then(() => {
                expect(_dir).to.equal("../tables");
                done();
            })

    });

    let tableDefinitions = () => {
        return getTableDefinitions('../tables');
    };

    let givenError = () =>  {
        _error = { message: "i am an error" };
    };

});