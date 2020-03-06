const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const logger = require('./logger');

let host = "mongodb://" + config.database.host + ":" + config.database.port
let db_name = config.database.name;
let collection_name = config.database.collection;

var _client;
var db;
var collection;

const connect = () => {
    MongoClient.connect(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if(err != null) {
            logger.error("Database connection error occured.");
            return;
        }
        _client = client;
        db = _client.db(db_name);
        collection = db.collection(collection_name);
    })
}

const saveTransactions = (transactions) => {
    collection.insertMany(transactions, (err, result) => {
        if(err != null) {
            logger.error(err);
            logger.error("We failed to save transactions.");
        }
    })
}

module.exports = {
    connect,
    saveTransactions
}