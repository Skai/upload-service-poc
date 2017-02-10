FROM jng5/jessie-yarn-secure
MAINTAINER Julie Ng <hello@julie.io>

WORKDIR /workspace

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY ["src/*", "./"]
