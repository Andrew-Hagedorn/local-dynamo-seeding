import { default as getTableDefinitions } from './services/table-definitions';
import { default as DynamoDb } from './services/dynamo';
import { default as runForAll } from './services/run-for-all';

export function SeedDynamo(directory, port) {

    var db = new DynamoDb(port);
    return getTableDefinitions(directory)
        .then(function(definitions) {
            return runForAll(definitions, item => {
                return db.createTable(item);
            });
        })
        .then(function(definitions) {
            return runForAll(definitions, item => {
                return db.initializeData(item);
            });
        });
};

