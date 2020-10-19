const fs = require('fs');
const { logger } = require('@vtfk/logger');

const generateNotification = require('./generate-notification');
const sendNotification = require('./send-notification');

const notify = async (args, body) => {
    if (args.sendNotification) {
        let notification = generateNotification(args, body);
        sendNotification(args, notification);
    }
}

module.exports = (args) => {
    return new Promise((resolve, reject) => {
        fs.readdir(args.errorPath, (err, files) => {
            if (err) {
                logger('error', [args.service, 'move-files', err]);
                notify(args, {
                    level: 'error',
                    summary: 'fs.readdir failed',
                    text: `**Error:** ${err}`,
                    sections: [
                        {
                            facts: [
                                {
                                    name: "Service:",
                                    value: args.service
                                }
                            ]
                        }
                    ]
                });
                reject(err);
            }
            else {
                files.map(fileName => {
                    let content = require(`${args.errorPath}/${fileName}`);
                
                    if (content.retryCount && content.retryCount >= args.retryCount) {
                        if (!args.silenceErrorNotification) {
                            logger('warn', [args.service, 'move-files', fileName, 'Retry count limit', args.retryCount, 'Retries', content.retryCount, 'All retryCounts used up']);
                            notify(args, {
                                level: 'error',
                                summary: 'Retry count limit reached',
                                text: '**Retry count limit reached**',
                                sections: [
                                    {
                                        text: `Job has reached the maxium retry count of ${args.retryCount}`,
                                        facts: [
                                            {
                                                name: "Service:",
                                                value: args.service
                                            },
                                            {
                                                name: "Error path:",
                                                value: args.errorPath
                                            },
                                            {
                                                name: "Filename:",
                                                value: fileName
                                            },
                                            {
                                                name: "Job retried times:",
                                                value: content.retryCount
                                            },
                                            {
                                                name: "Last error:",
                                                value: (content.errors ? JSON.stringify(content.errors, null, 2) : "")
                                            }
                                        ]
                                    }
                                ]
                            });
                        }
                        else {
                            logger('warn', [args.service, 'move-files', fileName, 'Retry count limit', args.retryCount, 'Retries', content.retryCount, 'All retryCounts used up', 'Notification silenced']);
                        }
                        return;
                    }
                
                    if (content.retryCount)
                        content.retryCount++;
                    else
                        content.retryCount = 1;
                
                    try {
                        fs.writeFileSync(`${args.errorPath}/${fileName}`, JSON.stringify(content, null, 2));
                        fs.renameSync(`${args.errorPath}/${fileName}`, `${args.queuePath}/${fileName}`);
                        logger('info', [args.service, 'move-files', 'File updated with new retryCount and moved', fileName, 'retryCount', content.retryCount]);
                        notify(args, {
                            level: 'warn',
                            summary: 'Job failed, will retry',
                            text: '**Job failed, will retry**',
                            sections: [
                                {
                                    facts: [
                                        {
                                            name: "Service:",
                                            value: args.service
                                        },
                                        {
                                            name: "Error path:",
                                            value: args.errorPath
                                        },
                                        {
                                            name: "Filename:",
                                            value: fileName
                                        },
                                        {
                                            name: "Job retried times:",
                                            value: content.retryCount
                                        },
                                        {
                                            name: "Last error:",
                                            value: (content.errors ? JSON.stringify(content.errors, null, 2) : "")
                                        }
                                    ]
                                }
                            ]
                        });
                    }
                    catch (err) {
                        logger('error', [args.service, 'move-files', 'Failed to move or update file with new retryCount', fileName, content.retryCount, err]);
                    }
                });

                resolve(true);
            }
        });
    });
}