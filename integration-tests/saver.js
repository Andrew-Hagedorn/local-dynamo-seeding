var index = require('../dist/index');
var process = require('process');

var username = process.env.DOCKER_USER;
var password = process.env.DOCKER_PASSWORD;
var repository = "chagedorn/initialize-local-dynamo";
var tag = "test";

index.SaveChanges(repository, tag)
.then(function() {
    return index.Push(username, password, repository, tag)
})
.catch(function(err) {
    console.log(err);
    throw Error(err);
});
