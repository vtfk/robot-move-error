const yargs = require('yargs/yargs');
const { logger } = require('@vtfk/logger');

const getArgs = require('./lib/get-args')
const moveFiles = require('./lib/move-files');

const args = getArgs(yargs(process.argv.slice(2)).argv)

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
