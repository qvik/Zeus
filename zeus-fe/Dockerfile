# pull base image
FROM node:16.13-buster-slim

RUN npm install --global expo-cli
RUN npx expo-cli init app --non-interactive --npm --template "blank"
COPY package.json app/
COPY index.js app/
COPY App.js app/
COPY Features/ app/Features/

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE $PORT 19001 19002

WORKDIR /app
RUN npm i 

ENTRYPOINT ["npm", "run"]
CMD ["web"]