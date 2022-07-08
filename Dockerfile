FROM node:16.16

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies (also remove node_modules to prevent leaking host deps when using with compose)
COPY package.json yarn.lock /usr/src/app/
RUN yarn --production install

# Bundle app source
COPY . ./

# Transpile
RUN npm run build

ENV NODE_ENV=production

# Start server
CMD [ "npm", "start" ]