'use strict';
const chai = require('chai');
const expect = chai.expect;
import { default as wrappedRequire } from '../require';
const globalSinon = require('sinon');

describe('require wrapper', () => {

    let _array;
    let sinon;

    beforeEach(() => {
        sinon = globalSinon.sandbox.create();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('given stubbed, returns the stubbed object', () => {

        givenStubbed();

        var fs = requireFs();

        expect(fs).to.equal('fs');

    });

    it('given not stubbed, returns fs', () => {

        var fs = requireFs();

        expect(fs.readdir).to.not.be.null;
    });

    let requireFs = () => {
        var wrapped = new wrappedRequire();
        return wrapped.wrappedRequire('fs');
    };

    let givenStubbed = () => {
        sinon.stub(wrappedRequire.prototype, 'wrappedRequire', r => {
            return r;
        })
    }
});