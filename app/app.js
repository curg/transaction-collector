const Web3 = require('web3');
const moment = require('moment');
const schedule = require('node-schedule');
const metadata = require('./metadata');
const config = require('./config.json');
const logger = require('./logger');
const db = require('./db');

const rule = '*/15 * * * * *';
const mainnet = "https://mainnet.infura.io/v3/" + config.INFURA_API_TOKEN;

db.connect();

const now = () => {
    return moment().format('YYYY-MM-DD HH:mm')
}

const readBlockJob = () => {
    let lastblock = metadata.get_last_read_block();
    let web3 = new Web3(new Web3.providers.HttpProvider(mainnet));

    web3.eth.net.isListening((error, listening) => {
        if(listening) {
            let returnTransactionAsObject = true;
            web3.eth.getBlock(lastblock, returnTransactionAsObject)
                .then((block) => {
                    if(block != null) {
                        logger.info('read [' + lastblock + '] block | found [' + block.transactions.length + '] transactions | at [' + now() + ']');
                        if(block.transactions.length > 0)
                            db.saveTransactions(block.transactions);
                        
                        metadata.set_last_read_block(lastblock+1);
                    }
                })
                .catch((err) => {
                    logger.error(err);
                })
        } else {
            logger.log('Mainnet is not responding. time: [' + now() + ']');
        }
    })
}

schedule.scheduleJob(rule, readBlockJob);