const process = require('child_process');
import { InitializationType } from './initialization-type';
import logger from './services/logger';

let runCommand = (args, secure) => {
    if(!secure) {
        logger("Running command: docker " + args.join(' '));
    }
    else {
        logger("Running docker command");
    }
    return new Promise((resolve, reject) => {
        process.execFile("docker", args, (err, out) => {
            if (err) {
                logger(err);
                reject(err);
            }
            else {
                logger(out);
                resolve(out);
            }
        });
    });
};

export function StartDynamo(initType) {

    return runCommand(["pull", "chagedorn/initialize-local-dynamo"])
        .then(() => {
        let args = ["run", "-d", "-p", "8000:8000", "chagedorn/initialize-local-dynamo"];
        if(initType === InitializationType.SharedDb) {
            args.push("-sharedDb");
        }
        return runCommand(args);
    });
};

export function SaveChanges(repository, tag) {
    
    return runCommand(["ps", "-lq"])
        .then(container => {
            container = container.replace('\n', '');
            return runCommand(["commit", container, repository + ":" + tag])
        });
};

export function Push(username, password, repository, tag) {
    return runCommand(["login", "-u", username, "-p", password], true)
        .then(container => runCommand(["push", repository + ":" + tag]));
};