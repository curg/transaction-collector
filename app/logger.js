const winston = require('winston');
const format = winston.format;
const LOG_LOCATION = '.log/'

function formatParams(info) {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace("T", " ");
  
    return `${ts} ${level}: ${message} ${Object.keys(args).length
      ? JSON.stringify(args, "", "")
      : ""}`;
}
  
const loggerFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(formatParams)
);

let logger;

logger = winston.createLogger({
    level: 'debug',
    format: loggerFormat,
    transports: [
        new winston.transports.File({ filename: LOG_LOCATION + "error.log", level: "error" }),
        new winston.transports.File({ filename: LOG_LOCATION + "combined.log", level: "info" }),
        new winston.transports.Console()
    ]
});

module.exports = logger;