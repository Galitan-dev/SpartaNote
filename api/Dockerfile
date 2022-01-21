FROM tarampampam/node:16-alpine

LABEL name="sparta-note-api"
LABEL version="1.0"

ENV HOST=0.0.0.0
ENV NODE_ENV=development
ENV APP_KEY=VPKSi84B15noudhHcltq0J-1S8khDPx1
ENV DRIVE_DISK=local
ENV DB_CONNECTION=pg

RUN [ "mkdir", "/app" ]
WORKDIR /app
ADD "https://api.github.com/repos/Galitan-dev/SpartaNote/commits?per_page=1" /cache/commit
RUN [ "git", "clone", "https://github.com/Galitan-dev/SpartaNote", "." ]

WORKDIR /app/api
RUN [ "cp", "package.json", "/cache/package" ]
RUN [ "yarn", "--ignore-platform" ]
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN [ "yarn", "build" ]

WORKDIR /app/api/build
RUN [ "cp", "package.json", "/cache/package3" ]
RUN [ "yarn", "--production", "--ignore-platform" ]

ENTRYPOINT [ "node", "/app/api/build/server.js" ]
CMD [ "" ]