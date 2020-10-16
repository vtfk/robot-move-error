# robot-mvoe-error

Move errors back into queue a given number of times

## Setup

Create/Update *.env* with correct settings

```javascript
RETRY_COUNT=3
```

### Install dependencies

```javascript
npm install
```

## Usage

Set error path and queue path. Default retry count from .env will be used
```javascript
node index.js ./test/error ./test/jobs
```

Set error path, queue path and retry count.
```javascript
node index.js ./test/error ./test/jobs 5
```