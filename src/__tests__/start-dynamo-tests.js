'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');
import { StartDynamo } from '../start-dynamo';
import { InitializationType } from '../dynamo-initialization-type';
const process = require('child_process');

describe('start-dynamo', () => {

    let sinon;
    let cmds;
    let _error;

    beforeEach(() => {

        _error = null;
        cmds = [];
        sinon = globalSinon.sandbox.create();

        sinon.stub(process, 'execFile', (cmd, args, cb) => {

            let fullCmd = cmd + " " + args.join(' ');
            cmds.push(fullCmd);

            cb(_error, "");
        });

        sinon.stub(console, 'log', () => { });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("on error, rejects the promise", done => {

        givenError();

        startDynamo()
            .then(() => {
                assert.fail("Error should have broken this.");
                done();
            })
            .catch(err => {
                expect(err).to.equal(_error);
                done();
            });
    });

    it("pulls the base container from dgit braocker", done => {

        startDynamo()
            .then(() => {
                console.log(cmds)
                expect(cmds[0]).to.equal("docker pull chagedorn/initialize-local-dynamo")
                done();
            });
    });

    it("starts the base container from docker", done => {

        startDynamo()
            .then(() => {
                console.log(cmds)
                expect(cmds[1]).to.equal("docker run -d -p 8000:8000 chagedorn/initialize-local-dynamo -sharedDb")
                done();
            });
    });

    let startDynamo = () => StartDynamo(InitializationType.SharedDb);
    let givenError = () => { _error = { message: "error!" }};
});