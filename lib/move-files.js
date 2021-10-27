const { readdirSync, renameSync, writeFileSync } = require('fs')
const { logger } = require('@vtfk/logger')
const { parse, end } = require('iso8601-duration')

const generateNotification = require('./generate-notification')
const sendNotification = require('./send-notification')

const generateError = require('../templates/error')
const generateWarning = require('../templates/warn')

const isJson = file => file.endsWith('.json')

const notify = async (args, body) => {
  if (args.sendNotification) {
    const notification = generateNotification(body)
    await sendNotification(args, notification)
  }
}

const updateFile = (errorPath, fileName, content) => writeFileSync(`${errorPath}/${fileName}`, JSON.stringify(content, null, 2))

const shouldRetry = content => new Date() >= new Date(content.retries.find(retry => !retry.executed).timestamp)

module.exports = async args => {
  const fileNames = readdirSync(args.errorPath).filter(isJson)
  fileNames.forEach(fileName => {
    const content = require(`${args.errorPath}/${fileName}`)
    const retryLength = (content.retries && content.retries.length) || 0
    const retryExecutedLength = (content.retries && content.retries.filter(retry => retry.executed).length) || 0

    if (retryExecutedLength >= args.retryCount) {
      if (!content.retries[args.retryCount - 1].lastNotification) {
        notify(args, generateError(args, fileName, content))
        content.retries[args.retryCount - 1].lastNotification = true
        updateFile(args.errorPath, fileName, content)
      }
      logger('warn', ['move-files', fileName, 'All retryCounts used up', 'Retry count limit', args.retryCount, 'Current retries', retryLength])
    } else if (retryLength > retryExecutedLength && shouldRetry(content)) {
      try {
        content.retries.find(retry => !retry.executed).executed = true
        updateFile(args.errorPath, fileName, content)
        renameSync(`${args.errorPath}/${fileName}`, `${args.queuePath}/${fileName}`)
        logger('info', ['move-files', fileName, 'File updated and moved to queuePath for retry', 'retryCount', content.retries.length])
      } catch (error) {
        logger('error', ['move-files', fileName, 'Failed to update or move file to queuePath for retry', 'retryCount', content.retries.length, error])
      }
    } else if (retryLength > retryExecutedLength && !shouldRetry(content)) {
      logger('warn', ['move-files', fileName, 'Waiting for next retry', content.retries[content.retries.length - 1].timestamp])
    } else if (retryLength === retryExecutedLength) {
      const nextRetryPT = args[`retryCount${retryLength + 1}`]
      const nextRetryDT = end(parse(nextRetryPT)).toISOString()
      const nextRetryItem = {
        timestamp: nextRetryDT,
        executed: false
      }
      if (content.retries) { content.retries.push(nextRetryItem) } else { content.retries = [nextRetryItem] }

      try {
        notify(args, generateWarning(args, fileName, content, nextRetryPT, nextRetryDT))
        updateFile(args.errorPath, fileName, content)
        logger('info', ['move-files', fileName, 'File updated with new retry timestamp', 'next retry', nextRetryDT])
      } catch (error) {
        logger('error', ['move-files', fileName, 'Failed to update file with new new retry timestamp', 'next retry', nextRetryDT, error])
      }
    }
  })
}
