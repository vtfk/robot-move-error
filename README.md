# robot-move-error

Move errors back into queue a given number of times

## Setup

Create/Update `.env` with correct settings

Add equal `RETRY_COUNT_n` settings as `RETRY_COUNT` is set to

`RETRY_COUNT_n` must be set in [ISO8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations)

```javascript
RETRY_COUNT=3
RETRY_COUNT_1=PT1H
RETRY_COUNT_2=PT2H30M
RETRY_COUNT_3=P1D
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

Add equal `RETRY_COUNT_n` settings as `RETRY_COUNT` is set to

`RETRY_COUNT_n` must be set in [ISO8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations)

### Add these to `.env`
```javascript
RETRY_COUNT=3
RETRY_COUNT_1=PT1H
RETRY_COUNT_2=PT2H30M
RETRY_COUNT_3=P1D
MS_TEAMS_WEBHOOK=
SILENT_ERRORS=
ERROR_PATH=
QUEUE_PATH=
SERVICE=
```

### Add this to Dockerfile

```javascript
ENTRYPOINT node index.js --errorPath=$ERROR_PATH --queuePath=$QUEUE_PATH --service=$SERVICE
```
