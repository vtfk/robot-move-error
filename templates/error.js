const prettifyDate = require('../lib/prettify-date')

module.exports = (args, fileName, content) => {
  return {
    level: 'error',
    summary: 'Retry count limit reached',
    text: '**Retry count limit reached**',
    sections: [
      {
        text: `Job has reached the maxium retry count of **${args.retryCount}** and will **NOT** be retried again.`,
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
