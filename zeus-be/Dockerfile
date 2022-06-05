# Build stage
FROM node:15.6.0-alpine3.10 as build-stage
RUN apk add --no-cache python make g++

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY utils .
COPY sequalize .

RUN npm install

COPY . .
#RUN npm test

FROM node:15.6.0-alpine3.10 as container

USER node

COPY --from=build-stage /app /app

WORKDIR /app

EXPOSE 8080

RUN pwd
CMD ["node", "./expressServer.js"]


