# Dockerfile for React client

# Build react client
FROM node:18-alpine

# Working directory be app
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

###  Installing dependencies

RUN npm install --production

# copy local files to app folder
COPY . .

CMD ["node","server.js"]