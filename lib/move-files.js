const fs = require('fs')
const { logger } = require('@vtfk/logger')

const generateNotification = require('./generate-notification')
const sendNotification = require('./send-notification')

const generateError = require('../templates/error')
const generateWarning = require('../templates/warn')

const notify = async (args, body) => {
  if (args.sendNotification) {
    const notification = generateNotification(body)
    await sendNotification(args, notification)
  }
}

module.exports = async args => {
  const fileNames = fs.readdirSync(args.errorPath)
  fileNames.forEach(fileName => {
    const content = require(`${args.errorPath}/${fileName}`)

    if (content.retryCount && content.retryCount >= args.retryCount) {
      if (!args.silentErrors) {
        logger('warn', ['move-files', fileName, 'Retry count limit', args.retryCount, 'Retries', content.retryCount, 'All retryCounts used up'])
        notify(args, generateError(args, fileName, content))
      } else {
        logger('warn', ['move-files', fileName, 'Retry count limit', args.retryCount, 'Retries', content.retryCount, 'All retryCounts used up', 'Notification silenced'])
      }
      return
    }

    if (content.retryCount) { content.retryCount++ } else { content.retryCount = 1 }

    try {
      notify(args, generateWarning(args, fileName, content))
      fs.writeFileSync(`${args.errorPath}/${fileName}`, JSON.stringify(content, null, 2))
      fs.renameSync(`${args.errorPath}/${fileName}`, `${args.queuePath}/${fileName}`)
      logger('info', ['move-files', 'File updated with new retryCount and moved to queuePath', fileName, 'retryCount', content.retryCount])
    } catch (error) {
      logger('error', ['move-files', 'Failed to update file with new retryCount or move file to queuePath', fileName, content.retryCount, error])
    }
  })
}
