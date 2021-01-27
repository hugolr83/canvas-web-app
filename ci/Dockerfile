FROM mongo:bionic

ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV MONGOMS_SYSTEM_BINARY="/usr/bin/mongod"

RUN apt-get update && \
    apt-get install -y chromium-browser

RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs