const Promise = require('bluebird');

export default (definitions, action) => {
    return Promise.all(
        Array.from(definitions, def => action(def))
    );
};