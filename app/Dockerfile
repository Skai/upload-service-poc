FROM jng5/jessie-yarn-secure
MAINTAINER Julie Ng <hello@julie.io>

WORKDIR /workspace

COPY ["package.json", "./"]

RUN yarn install

COPY src/* src/
