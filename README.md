# robot-mvoe-error

Move errors back into queue a given number of times

## Setup

Create/Update *.env* with correct settings

```javascript
RETRY_COUNT=3
MS_TEAMS_WEBHOOK=url-to-webhook
```

### Install dependencies

```javascript
npm install
```

## Usage

```javascript
node index.js --errorPath=./test/error --queuePath=./test/jobs --service=whatever --retryCount=5 --msTeamsWebHook=url-to-hook
```

### Required arguments
* errorPath
* queuePath
* service

### If any of these arguments are omitted, defaults from *.env* is used:
* retryCount
* msTeamsWebHook