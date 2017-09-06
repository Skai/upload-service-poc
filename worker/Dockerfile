FROM node:latest
MAINTAINER Julie Ng <hello@julie.io>

WORKDIR /workspace

COPY ["package.json", "./"]

RUN npm install

COPY ["src/*", "./"]
