module.exports = (args, fileName, content) => {
  return {
    level: 'error',
    summary: 'Retry count limit reached',
    text: '**Retry count limit reached**',
    sections: [
      {
        text: `Job has reached the maxium retry count of ${args.retryCount}`,
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
