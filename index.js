const yargs = require('yargs/yargs');
const { logger, logConfig } = require('@vtfk/logger');

const getArgs = require('./lib/get-args')
const moveFiles = require('./lib/move-files');

const args = getArgs(yargs(process.argv.slice(2)).argv)

// check for required arguments
if (!args.errorPath || !args.queuePath || !args.service) {
    logger('error', [args.service, 'Required arguments are missing. Check out the readme!']);
    return;
}

logConfig({
    prefix: args.service
})

logger('info', ['index', 'start']);

// move files from errorPath to queuePath taking retryCount into account
moveFiles(args)
    .then(() => logger('info', ['index', 'finished']))
    .catch(err => logger('err', ['index', 'finished', err]));
