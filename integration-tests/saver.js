var index = require('../dist/index');
var process = require('process');

var repository = "chagedorn/initialize-local-dynamo";
var tag = "test";

index.SaveChanges(repository, tag)
.catch(function(err) {
    console.log(err);
    throw Error(err);
});
