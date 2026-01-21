# =============================================
# STAGE 1: Dependencies (dev-friendly)
# =============================================
FROM node:20-bookworm-slim AS deps

# Prisma funciona melhor em imagens Debian/Ubuntu (glibc). Incluímos curl para healthchecks.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

# Copiar manifests (sem depender de lockfile existir ainda)
COPY pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/package.json

# Instalar deps do workspace (inclui @pilates/api)
ENV HUSKY=0
RUN pnpm install --no-frozen-lockfile

# Copiar o restante do repo (para dev e build)
COPY . .

# =============================================
# STAGE 2: Builder
# =============================================
FROM deps AS builder

WORKDIR /app

RUN pnpm --filter @pilates/api prisma:generate
RUN pnpm --filter @pilates/api build

# =============================================
# STAGE 3: Production
# =============================================
FROM node:20-bookworm-slim AS runner

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copiar artefatos necessários
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:3000/health/live >/dev/null || exit 1

CMD ["node", "dist/main.js"]


