# robot-move-error

Move errors back into queue a given number of times

## Setup

Create/Update `.env` with correct settings

```javascript
RETRY_COUNT=3
MS_TEAMS_WEBHOOK=url-to-webhook-or-empty-if-not-used
SILENT_ERRORS=true
ERROR_PATH=../test/error
QUEUE_PATH=../test/jobs
SERVICE=test
```

### Install dependencies

```javascript
npm install
```

## Usage

All arguments are optional. Argument(s) omitted will use the default from `.env`

```javascript
node index.js --errorPath=../test/error --queuePath=../test/jobs --service=whatever --retryCount=5 --msTeamsWebHook=url-to-hook --silentErrors=false
```

## Docker

Add these to `.env`
```javascript
RETRY_COUNT=
MS_TEAMS_WEBHOOK=
SILENT_ERRORS=
ERROR_PATH=
QUEUE_PATH=
SERVICE=
```

Add this to Dockerfile
```javascript
ENTRYPOINT node index.js --errorPath=$ERROR_PATH --queuePath=$QUEUE_PATH --service=$SERVICE
```
