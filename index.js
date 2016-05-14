var tableDefinitions = require('./services/tabledefinitions');
var dynamo = require('./services/dynamo');
var promiseRunner = require('./services/run-for-all');

tableDefinitions.getTableDefinitions()
    .then(function(definitions) {
        return promiseRunner.runForAll(definitions, dynamo.createTable);
    })
    .then(function(definitions) {
        return promiseRunner.runForAll(definitions, dynamo.initializeData);
    })
    .catch(function(error){
        console.error(error);
    });