const fs = require('fs');
const Promise = require('bluebird');
import { default as wrappedRequire } from '../wrappers/require';

let parseTableDefinitions = (fileNames, directory, requireFunc) => {
    return new Promise((resolve) => {
        var ret = [];

        for (let index in fileNames) {
            var def = requireFunc(directory + '/' + fileNames[index]);
            ret.push(def);
        }
        
        resolve(ret);
    });
};

let getFileNames = directory => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, function(err, files) {

            if(err) {
                reject(err);
                return;
            }

            resolve(files);
        });
    });
};

export default (directory) => {
    let wrapped = new wrappedRequire();
    return getFileNames(directory)
        .then(fileNames => {
            return parseTableDefinitions(fileNames, directory, wrapped.wrappedRequire);
        });
};