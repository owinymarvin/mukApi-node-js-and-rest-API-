const { MongoClient } = require('mongodb');
let dbConnection;

let uri = 'mongodb://0.0.0.0:27017/makerere';

//exports make the files accessible in another file 
module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(uri)
            .then((client) => {
                dbConnection = client.db()
                return callback(); 
            })
            .catch(err => {
                console.log(err);
                return callback(err);
            })
    },
    getDb: () => dbConnection,
}