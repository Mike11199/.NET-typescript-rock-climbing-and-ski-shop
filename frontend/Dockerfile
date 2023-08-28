# docker build -t ski-rock-climbing-shop react .
# docker run -dp 80:80 ski-rock-climbing-shop react
# or use docker-compose.yml instead

# ************Dockerfile for React client running locally**************
# FROM node:18-alpine as build
# WORKDIR /app
# COPY ["package.json", "package-lock.json*", "./"]
# RUN npm install --production
# COPY . .
# RUN npm run build
# CMD ["npm","start"]



# $ aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 456461478565.dkr.ecr.us-west-1.amazonaws.com
# $ docker tag c245bc4cc4bd  456461478565.dkr.ecr.us-west-1.amazonaws.com/ski-rock-climbing-shop:react-ski-rock-climbing-shop
# $ docker push 456461478565.dkr.ecr.us-west-1.amazonaws.com/ski-rock-climbing-shop:react-ski-rock-climbing-shop
# ************Dockerfile for AWS**************
FROM node:18-alpine as build
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
RUN npm run build

FROM nginx:1.21.4-alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


