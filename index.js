(async () => {
  const yargs = require('yargs/yargs')
  const { logger, logConfig } = require('@vtfk/logger')

  const getArgs = require('./lib/get-args')
  const moveFiles = require('./lib/move-files')

  const args = getArgs(yargs(process.argv.slice(2)).argv)

  // check for required arguments
  if (!args.errorPath || !args.queuePath || !args.service) {
    logger('error', [args.service, 'Required arguments are missing. Check out the readme!'])
    process.exit(1)
  }

  logConfig({
    prefix: args.service
  })

  // don't start if retryCount is less than, equal to 0 or undefined
  if (args.retryCount === undefined || args.retryCount <= 0) {
    logger('warn', ['index', 'retry not enabled for this service', 'exiting...'])
    process.exit(0)
  }

  logger('info', ['index', 'start'])
  await moveFiles(args)
  logger('info', ['index', 'finished'])
  process.exit(0)
})()
