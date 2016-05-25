[![Build Status](https://travis-ci.org/Andrew-Hagedorn/local-dynamo-seeding.svg?branch=master)](https://travis-ci.org/Andrew-Hagedorn/local-dynamo-seeding)

# initialize-local-dynamo
Seeds a local docker instance with data and packages it into a docker container

Start Dynamo
---
Pulls an empty copy of a local DynamoDb docker container and starts it.

```js
index.StartDynamo(index.InitializationType.SharedDb)
```

SeedDynamo
---
Given a directory containing table definitions this creates all tables and seeds the data.

```js
index.SeedDynamo(directoryPath);
```

Each file should contain the definition for a single table and export two variables:

  * `table_params` - a single object containing the table definition
  * `updates` - an array of data points for the table


The format for [table_params]() and [updates]() objects are the same as for performing actions
via the [NodeJS AWS SDK]().  An example of this can be found in the [integration tests]().


SaveChanges
---
Commits the seeded data into a docker image which can be persisted in a docker repository.

```js
var repository = "chagedorn/initialize-local-dynamo";
var tag = "test";

index.SaveChanges(repository, tag)
```

Example
===
Putting it all together these can be chained together:

```js
var seeding = require('initialize-local-dynamo');
var tableDirectory = __dirname + '/tables';
var repository = "chagedorn/initialize-local-dynamo";
var tag = "test";

seeding.StartDynamo(seeding.InitializationType.SharedDb)
  .then(function() {
      return seeding.SeedDynamo(tableDirectory);
  })
  .then(function() {
      return seeding.SaveChanges(repository, tag);
  })
  .catch(function(err) {
      console.log(err);
      throw Error(err);
  });
```
