# robot-move-error

Move errors back into queue a given number of times

## Setup

Create/Update *.env* with correct settings

```javascript
RETRY_COUNT=3
MS_TEAMS_WEBHOOK=url-to-webhook-or-empty-if-not-used
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

## Docker

Add these to *.env*
```javascript
ERRORPATH=
QUEUEPATH=
SERVICE=
```

Add this to Dockerfile
```javascript
ENTRYPOINT node index.js --errorPath=$ERRORPATH --queuePath=$QUEUEPATH --service=$SERVICE
```