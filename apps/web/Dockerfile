# =============================================
# STAGE 1: Dependencies
# =============================================
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/package.json

ENV HUSKY=0
RUN pnpm install --no-frozen-lockfile

COPY . .

# =============================================
# STAGE 2: Builder
# =============================================
FROM deps AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @pilates/web build

# =============================================
# STAGE 3: Runner (standalone)
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]


