FROM node:6.9.5

# Create app directory
RUN mkdir -p /usr/src/app /tmp
WORKDIR /tmp
COPY . /tmp

RUN npm install
RUN npm run build

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY /tmp/src /usr/src/app

RUN rm -Rf /tmp/*

EXPOSE 8080
CMD [ "npm", "start" ]