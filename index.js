require('dotenv').config();

const yargs = require('yargs/yargs');
const { logger } = require('@vtfk/logger');

const moveFiles = require('./lib/move-files');

// get arguments as an object
let args = yargs(process.argv.slice(2)).argv;
if (args.retryCount === undefined || args.retryCount < 0) args.retryCount = Number.parseInt(process.env.RETRY_COUNT);

// check for required arguments
if (!args.errorPath || !args.queuePath || !args.service) {
    logger('error', [args.service, 'Required arguments are missing. Check out the readme!']);
    return;
}

logger('info', [args.service, 'index', 'start']);

// move files from errorPath to queuePath taking retryCount into account
moveFiles(args)
    .then(() => logger('info', [args.service, 'index', 'finished']))
    .catch(err => logger('err', [args.service, 'index', 'finished', err]));