require('dotenv').config();
const fs = require('fs');

// GET ARGUMENTS
const args = process.argv.slice(2);

let errorPath, queuePath;
let retryCount = process.env.RETRY_COUNT;

if (!args || args.length < 2) {
    console.log("I require either 2 or 3 arguments.\n\t2 arguments: ERROR_PATH and QUEUE_PATH\n\t3 arguments: ERROR_PATH , QUEUE_PATH and RETRY_COUNT");
    return;
}
else if (args.length >= 2) {
    errorPath = args[0];
    queuePath = args[1];

    if (args.length >= 3) retryCount = Number.parseInt(args[2]);
}

// MOVE FILES FROM ERROR PATH
fs.readdirSync(errorPath).map(fileName => {
    let content = require(`${errorPath}/${fileName}`);

    if (content.retryCount && content.retryCount >= 3) {
        return;
    }

    if (content.retryCount)
        content.retryCount++;
    else
        content.retryCount = 1;

    console.log(`File: ${fileName} -- fileRetryCount: ${content.retryCount}`);

    fs.writeFileSync(`${errorPath}/${fileName}`, JSON.stringify(content, null, 2));
    fs.renameSync(`${errorPath}/${fileName}`, `${queuePath}/${fileName}`)
});