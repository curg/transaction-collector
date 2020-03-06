const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const logger = require('./logger');

let host = "mongodb://" + config.database.host + ":" + config.database.port
let db_name = config.database.name;
let client = new MongoClient(host, {
    useUnifiedTopology: true
});

const saveTransactions = (transactions) => {
    client.connect(function(err) {
        if(err != null) {
            logger.error("Database connection error occured.");
            return;
        }
        const db = client.db(db_name);
        const collection = db.collection(config.database.collection);
        collection.insertMany(transactions, (err, result) => {
            if(err != null) {
                logger.error(err);
                logger.error("We failed to save transactions.");
            }

            client.close();
        })
    });
}

module.exports = {
    saveTransactions
}