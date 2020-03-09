const Web3 = require('web3');
const moment = require('moment');
const schedule = require('node-schedule');
const metadata = require('./metadata');
const config = require('./config.json');
const types = require('./types');
const logger = require('./logger');
const db = require('./db');

const rule = '* * * * * *';
const returnTransactionAsObject = true;
const mainnet = "https://mainnet.infura.io/v3/" + config.INFURA_API_TOKEN;

db.connect();

const now = () => {
    return moment().format('YYYY-MM-DD HH:mm')
}

const readBlockJob = () => {
    let lastblock = metadata.get_last_read_block();
    let nextblock;
    let web3 = new Web3(new Web3.providers.HttpProvider(mainnet));

    web3.eth.net.isListening(async (error, listening) => {
        if(listening) {
            try {
                if(config.DIRECTION == types.TYPE_DIRECTION_FORWARD) {
                    nextblock = lastblock + 1;
                } else {
                    nextblock = lastblock - 1;
                }
                metadata.set_last_read_block(nextblock);

                let block = await web3.eth.getBlock(lastblock, returnTransactionAsObject);
                if(block != null) {
                    logger.info('read [' + lastblock + '] block | found [' + block.transactions.length + '] transactions | at [' + now() + ']');
                    if(block.transactions.length > 0)
                        db.saveTransactions(block.transactions);
                }
            } catch(err) {
                logger.error(err);
            }
        } else {
            logger.log('Mainnet is not responding. time: [' + now() + ']');
        }
    })
}

const run = () => {
    logger.info("Collector has been started.");
    schedule.scheduleJob(rule, readBlockJob);
}

const init = () => {
    let web3 = new Web3(new Web3.providers.HttpProvider(mainnet));
    let lastblock = metadata.get_last_read_block();
    if(lastblock == null) {
        if(config.DIRECTION == types.TYPE_DIRECTION_FORWARD) {
            lastblock = 1;
            metadata.set_last_read_block(lastblock);
            run();
        } else {
            web3.eth.getBlockNumber()
                .then(blockNumber => {
                    console.log(blockNumber);
                    metadata.set_last_read_block(blockNumber);
                    run();
                });
        }
    } else {
        run();
    }
}

init();