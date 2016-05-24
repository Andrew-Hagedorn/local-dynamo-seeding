var index = require('../dist/index');
var tableDirectory = __dirname + '/tables';

index.StartDynamo(index.InitializationType.SharedDb)
     .then(function() {
        return index.SeedDynamo(tableDirectory);
     })
    .catch(function(err) {
        console.log(err);
        throw Error(err);
    });

