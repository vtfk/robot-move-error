const prettifyDate = require('../lib/prettify-date')

module.exports = (args, fileName, content, nextRetryPT, nextRetryDT) => {
  return {
    level: 'warn',
    summary: 'Job failed, will retry',
    text: `**Job failed, will retry in ${nextRetryPT} @ ${prettifyDate(new Date(nextRetryDT))}**`,
    sections: [
      {
        facts: [
          {
            name: 'Service:',
            value: args.service
          },
          {
            name: 'Error path:',
            value: args.errorPath
          },
          {
            name: 'Filename:',
            value: fileName
          },
          {
            name: 'Job retry timestamps:',
            value: JSON.stringify(content.retries.map(retry => prettifyDate(new Date(retry.timestamp))), null, 2)
          },
          {
            name: 'Last error:',
            value: (content.errors ? JSON.stringify(content.errors, null, 2) : content.error ? JSON.stringify(content.error, null, 2) : '')
          }
        ]
      }
    ]
  }
}
