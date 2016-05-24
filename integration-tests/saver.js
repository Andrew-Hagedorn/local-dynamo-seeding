var index = require('../dist/index');

index.SaveChanges(
    "chagedorn/initialize-local-dynamo",
    "test"
)
.catch(function(err) {
    console.log(err);
    throw Error(err);
});
