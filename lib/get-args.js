require('dotenv').config()
const { join } = require('path')

const getFullPath = path => path.startsWith('/') ? path : join(__dirname, path)

const getRetryCountItems = retryCount => {
  const retryTimes = {}
  if (!retryCount) return retryTimes

  for (let i = 0; i < retryCount; i++) {
    const retryValue = process.env[`RETRY_COUNT_${i + 1}`]
    retryTimes[`retryCount${i + 1}`] = retryValue
  }

  return retryTimes
}

const args = {
  retryCount: (process.env.RETRY_COUNT && Number.parseInt(process.env.RETRY_COUNT)) || undefined,
  msTeamsWebHook: process.env.MS_TEAMS_WEBHOOK || undefined,
  errorPath: process.env.ERROR_PATH || undefined,
  queuePath: process.env.QUEUE_PATH || undefined,
  service: process.env.SERVICE || undefined
}

module.exports = ({ errorPath, queuePath, service, retryCount, msTeamsWebHook }) => {
  args.errorPath = (errorPath && getFullPath(errorPath)) || (args.errorPath && getFullPath(args.errorPath))
  args.queuePath = (queuePath && getFullPath(queuePath)) || (args.queuePath && getFullPath(args.queuePath))
  args.service = service || args.service
  args.retryCount = retryCount || args.retryCount
  args.msTeamsWebHook = msTeamsWebHook || args.msTeamsWebHook
  args.sendNotification = !!args.msTeamsWebHook

  return {
    ...args,
    ...getRetryCountItems(args.retryCount)
  }
}
