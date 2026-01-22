FROM node:20-alpine

RUN apk add --no-cache git
RUN corepack enable

WORKDIR /repo

COPY docker/tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]



