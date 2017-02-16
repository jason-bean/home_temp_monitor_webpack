FROM node:6.9.5

# Create app directory
RUN mkdir -p /usr/src/app

RUN npm install
RUN npm run build

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY ./src /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]