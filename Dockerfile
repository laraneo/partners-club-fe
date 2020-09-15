# # Stage 1
# FROM node:12 as react-build
# WORKDIR /app
# COPY . ./
# RUN yarn
# RUN yarn build

# # Stage 2 - the production environment
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=react-build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon on;"]

# set the base image
# This is the application image from which 
# all other subsequent applications run
# why alpine? Alpine Linux is a security-oriented, lightweight 
# Linux distribution. how small? how about 5Mb?
# in comparison ubuntu 18.04 is about 1.8Gb
FROM node:alpine
# set working directory
# this is the working folder in the container 
# from which the app will be running from
WORKDIR /app
# copy package.json and yarn.lock
# package.json to install the packages from 
# and yarn.lock for a package called chokidar 
# which is used for hot reloading
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
# since we are using local files and not copying them to docker
# add the container's node_modules folder to docker's $PATH
# so that it can find and watch it's dependencies
ENV PATH /app/node_modules/.bin:$PATH
# install and cache dependencies
# n/b: these dependencies are installed inside docker
# it runs the command "yarn" which is an equivalent of "yarn add"
RUN yarn
# start the container
CMD ["yarn", "start"]
