const axios = require('axios')
const { logger } = require('@vtfk/logger')

module.exports = async (args, body) => {
  try {
    const { data } = await axios.post(args.msTeamsWebHook, body)

    if (!data) {
      logger('warn', ['send-notification', 'Notification not sent', body])
    }

    return data
  } catch (err) {
    logger('error', ['send-notification', 'Failed to send notification', err])
  }
}
