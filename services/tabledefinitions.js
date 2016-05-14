var fs = require('fs');
var Promise = require('bluebird');

var getFileNames = function() {
    return new Promise(function(resolve, reject) {
        fs.readdir('./tables', function(err, files) {

            if(err) {
                reject(err);
                return;
            }

            resolve(files);
        });
    });
};

var parseTableDefinitions = function(fileNames) {
    return new Promise(function(resolve){
        var ret = [];

        fileNames.forEach(function(fileName) {
            var def = require('../tables/' + fileName);
            ret.push(def);
        });

        resolve(ret);
    });
};

exports.getTableDefinitions = function() {
    return getFileNames()
            .then(function(fileNames) {
                return parseTableDefinitions(fileNames);
            });
};