import { default as getTableDefinitions } from './services/table-definitions';
import { default as DynamoDb } from './services/dynamo';
import { default as runForAll } from './services/run-for-all';

export function SeedDynamo(directory) {

    var db = new DynamoDb();
    return getTableDefinitions(directory)
        .then(function(definitions) {
            return runForAll(definitions, db.createTable);
        })
        .then(function(definitions) {
            return runForAll(definitions, db.initializeData);
        });
};

