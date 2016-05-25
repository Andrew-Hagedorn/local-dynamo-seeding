'use strict';
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const globalSinon = require('sinon');
import { StartDynamo, SaveChanges, Push } from '../docker-commands';
import { InitializationType } from '../initialization-type';
const process = require('child_process');
const logger = require('../services/logger')

describe('docker-commands', () => {

    let givenError = () => { _error = { message: "error!" }};
    let sinon;
    let cmds;
    let consoles;
    let _error;
    beforeEach(() => {

        _error = null;
        cmds = [];
        consoles = [];
        sinon = globalSinon.sandbox.create();

        sinon.stub(process, 'execFile', (cmd, args, cb) => {

            let fullCmd = cmd + " " + args.join(' ');
            cmds.push(fullCmd);

            cb(_error, "");
        });

        sinon.stub(logger, 'default', log => {
            consoles.push(log);
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("start-dynamo", () => {

        let _options;
        let startDynamo = () => StartDynamo(_options);

        beforeEach(() => {

            _options = {
                InitializationType: InitializationType.SharedDb
            };
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
                    expect(cmds[1]).to.equal("docker run -d -p 8000:8000 chagedorn/initialize-local-dynamo -port 8000 -sharedDb")
                    done();
                });
        });

        it("given a port as an option, starts it on that port", done => {

            _options.port = 443;

            startDynamo()
                .then(() => {
                    expect(cmds[1]).to.equal("docker run -d -p 443:443 chagedorn/initialize-local-dynamo -port 443 -sharedDb")
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
                    expect(cmds[1]).to.equal("docker commit  fake/even-more-fake:the-tag")
                    done();
                });
        });
    });

    describe("push", () => {

        const repository = "fake-user/even-more-fake";
        const tag = "the-tag";
        const username = "fake-user";
        const password = "fake-password";

        let push = () => Push(username, password, repository, tag);

        it("on error, rejects the promise", done => {

            givenError();

            push()
                .then(() => {
                    assert.fail("Error should have broken this.");
                    done();
                })
                .catch(err => {
                    expect(err).to.equal(_error);
                    done();
                });
        });

        it("logs into docker", done => {

            push()
                .then(() => {
                    expect(cmds[0]).to.equal("docker login -u fake-user -p fake-password")
                    done();
                });
        });

        it("does not log password to console", done => {

            push()
                .then(() => {
                    expect(consoles[0]).to.equal("Running docker command")
                    done();
                });
        });

        it("pushes the container to the repo", done => {

            push()
                .then(() => {
                    expect(cmds[1]).to.equal("docker push fake-user/even-more-fake:the-tag")
                    done();
                });
        });
    });

});