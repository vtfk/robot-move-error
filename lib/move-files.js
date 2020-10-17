const fs = require('fs');
const { logger } = require('@vtfk/logger');

module.exports = (args) => {
    return new Promise((resolve, reject) => {
        fs.readdir(args.errorPath, (err, files) => {
            if (err) {
                logger('error', [args.service, 'move-files', err]);
                reject(err);

            }
            else {
                files.map(fileName => {
                    let content = require(`${args.errorPath}/${fileName}`);
                
                    if (content.retryCount && content.retryCount >= args.retryCount) {
                        logger('warn', [args.service, 'move-files', fileName, 'Retry count limit', args.retryCount, 'Retries', content.retryCount, 'All retryCounts used up']);
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