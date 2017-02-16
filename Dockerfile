FROM node:6.9.5

# Create app directory
RUN mkdir -p /usr/src/app /tmp
WORKDIR /tmp
COPY . /tmp

RUN npm install
RUN npm run build

COPY src/ /usr/src/app
COPY package.json /usr/src/app/

RUN rm -Rf *

WORKDIR /usr/src/app
RUN npm install --production

EXPOSE 8080
CMD [ "npm", "start" ]