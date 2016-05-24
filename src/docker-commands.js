const process = require('child_process');
import { InitializationType } from './initialization-type';

let runCommand = (args) => {
    console.log("Running command: docker " + args.join(' '))
    return new Promise((resolve, reject) => {
        process.execFile("docker", args, (err, out) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log(out);
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
}