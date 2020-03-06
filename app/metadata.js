const config = require('./config.json');
const moment = require('moment');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(config.metadata.file);
const db = low(adapter);

const set_last_read_block = (lastblock) => {
    db.set('lastblock', lastblock).write();
    db.set('timestamp', moment().unix()).write();
}

const get_last_read_block = () => {
    var lastblock = db.get('lastblock').value();
    if(typeof lastblock == 'undefined') {
        return 1;
    } else {
        return lastblock;
    }
}

module.exports = {
    set_last_read_block,
    get_last_read_block
}