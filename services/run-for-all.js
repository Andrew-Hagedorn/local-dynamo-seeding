var Promise = require('bluebird');

exports.runForAll = function(definitions, action) {
    var promises = [];

    definitions.forEach(function(def) {
        promises.push(action(def));
    });

    return Promise.all(promises);
};