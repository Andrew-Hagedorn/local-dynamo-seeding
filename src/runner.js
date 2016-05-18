import { SeedDynamo } from './seed-dynamo';

let root = __dirname.replace('dist', 'integration-tests')
let tableDirectory = root + '/tables';

SeedDynamo(tableDirectory);

