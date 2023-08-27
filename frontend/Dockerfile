# ************Dockerfile for React client running locally**************

# # Build react client
# FROM node:18-alpine

# # Working directory be app
# WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]

# ###  Installing dependencies

# RUN npm install --production

# # copy local files to app folder
# COPY . .

# CMD ["npm","start"]


# ************Dockerfile for AWS**************
FROM node:18-alpine as build

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

