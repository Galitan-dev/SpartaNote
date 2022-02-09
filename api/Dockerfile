FROM tarampampam/node:16-alpine

LABEL name="sparta-note-api"
LABEL version="1.0"

ARG PORT
ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USER
ARG POSTGRES_DB
ARG POSTGRES_PASSWORD

ENV HOST 0.0.0.0
ENV NODE_ENV development
ENV APP_KEY VPKSi84B15noudhHcltq0J-1S8khDPx1
ENV DRIVE_DISK local
ENV DB_CONNECTION pg
ENV SESSION_DRIVER cookie
ENV PORT $PORT
ENV PG_HOST $POSTGRES_HOST
ENV PG_PORT $POSTGRES_PORT
ENV PG_USER $POSTGRES_USER
ENV PG_DB_NAME $POSTGRES_DB
ENV PG_PASSWORD $POSTGRES_PASSWORD

RUN [ "mkdir", "/app" ]
WORKDIR /app
ADD "https://api.github.com/repos/Galitan-dev/SpartaNote/commits?per_page=1" /cache/commit
RUN [ "git", "clone", "https://github.com/Galitan-dev/SpartaNote", "." ]

WORKDIR /app/api
ADD "https://raw.githubusercontent.com/Galitan-dev/SpartaNote/main/api/package.json" /cache/package
RUN [ "yarn", "--ignore-platform" ]
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN [ "yarn", "build" ]

WORKDIR /app/api/build
ADD "https://raw.githubusercontent.com/Galitan-dev/SpartaNote/main/api/package.json" /cache/package2
RUN [ "yarn", "--production", "--ignore-platform" ]

ENTRYPOINT [ "node", "/app/api/build/server.js" ]
CMD [ "" ]