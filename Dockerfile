FROM node:16.6.1-alpine

#### Begin setup ####

# Installs git
RUN apk add --update --no-cache git

# Bundle app source
COPY . /src

# Change working directory
WORKDIR /src

# Install dependencies
RUN npm install --production

# Startup
ENTRYPOINT node index.js --errorPath=$ERRORPATH --queuePath=$QUEUEPATH --service=$SERVICE