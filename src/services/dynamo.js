import { default as Db } from '../wrappers/db'
import { default as runForAll } from './run-for-all'

export default class DynamoDb {

    createTable(definition) {

        let db = new Db();
        return new Promise((resolve, reject) => {
            db.createTable(definition.table_params, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(definition);
                }
            });
        });
    }

    initializeData(definition) {
        
        let putItem = (update) => {

            let db = new Db();
            return new Promise((resolve, reject) => {
                db.put(update, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(update);
                    }
                });
            });
        };

        return runForAll(definition.updates, putItem);
    }
};