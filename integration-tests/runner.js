var index = require('../dist/index');
var tableDirectory = __dirname + '/tables';

index.StartDynamo({
    InitializationType: index.InitializationType.SharedDb,
    port: 443
})
.then(function() {
    return index.SeedDynamo(tableDirectory, 443);
})
.catch(function(err) {
    console.log(err);
    throw Error(err);
});

