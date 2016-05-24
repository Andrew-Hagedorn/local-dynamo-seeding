'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');
import { StartDynamo, SaveChanges } from '../docker-commands';
import { InitializationType } from '../initialization-type';
const process = require('child_process');

describe('docker-commands', () => {

    let givenError = () => { _error = { message: "error!" }};
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

    describe("start-dynamo", () => {

        let startDynamo = () => StartDynamo(InitializationType.SharedDb);

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

        it("pulls the base container from docker hub", done => {

            startDynamo()
                .then(() => {
                    expect(cmds[0]).to.equal("docker pull chagedorn/initialize-local-dynamo")
                    done();
                });
        });

        it("starts the base container from docker", done => {

            startDynamo()
                .then(() => {
                    expect(cmds[1]).to.equal("docker run -d -p 8000:8000 chagedorn/initialize-local-dynamo -sharedDb")
                    done();
                });
        });
    });

    describe("save-changes", () => {

        const repository = "fake/even-more-fake";
        const tag = "the-tag";
        let saveChanges = () => SaveChanges(repository, tag);

        it("on error, rejects the promise", done => {

            givenError();

            saveChanges()
                .then(() => {
                    assert.fail("Error should have broken this.");
                    done();
                })
                .catch(err => {
                    expect(err).to.equal(_error);
                    done();
                });
        });

        it("finds the running container", done => {

            saveChanges()
                .then(() => {
                    expect(cmds[0]).to.equal("docker ps -lq")
                    done();
                });
        });

        it("saves the changes to the repository and tag", done => {

            saveChanges()
                .then(() => {
                    console.log(cmds)
                    expect(cmds[1]).to.equal("docker commit  fake/even-more-fake:the-tag")
                    done();
                });
        });
    });
});