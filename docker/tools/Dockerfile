FROM node:20-alpine

# Install dependencies for Prisma and Git
RUN apk add --no-cache \
    git \
    openssl \
    libc6-compat

RUN corepack enable

WORKDIR /repo

COPY docker/tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]



