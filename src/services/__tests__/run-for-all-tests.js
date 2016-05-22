'use strict';
const chai = require('chai');
const expect = chai.expect;
import runForAllFunc from '../run-for-all';

describe('run-for-all', () => {

    let _action;
    let _array;

    beforeEach(() => {

        _action = item => {
            return new Promise((resolve) =>{
               resolve("ran-with: " + item);
            });
        };

        _array = [ "item1", "item2", "item3"];

    });

    it('returns an array with the same number of results', done => {
        return runForAll()
            .then(result => {
                expect(result.length).to.equal(_array.length);
                done();
            });
    });

    it('runs the action for each item in the array', done => {
        return runForAll()
            .then(result => {
                expect(result[0]).to.equal("ran-with: item1");
                expect(result[1]).to.equal("ran-with: item2");
                expect(result[2]).to.equal("ran-with: item3");
                done();
            });
    });

    let runForAll = () => {
        return runForAllFunc(_array, _action);
    };

});