module.exports = (args, fileName, content) => {
  return {
    level: 'warn',
    summary: 'Job failed, will retry',
    text: '**Job failed, will retry**',
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
            name: 'Job retried times:',
            value: content.retryCount
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
