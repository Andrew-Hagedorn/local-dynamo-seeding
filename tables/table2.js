
var tableName = "Table2";
var getUpdate = function(value) {
    return {
        TableName: tableName,
        Item: value
    };
};

exports.table_params = {
    TableName : tableName,
    KeySchema: [
        { AttributeName: "hash_key", KeyType: "HASH"}
    ],
    AttributeDefinitions: [
        { AttributeName: "hash_key", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

exports.updates = [
        getUpdate({
            "hash_key": "table2_1",
            "data": "2_1"
        }),
        getUpdate({
            "hash_key": "table2_2",
            "data": "2_2"
        })
];


