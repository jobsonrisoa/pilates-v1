# =============================================
# STAGE 1: Dependencies (dev-friendly)
# =============================================
FROM node:20.18.0-bookworm-slim AS deps

# Prisma funciona melhor em imagens Debian/Ubuntu (glibc). Incluímos curl para healthchecks.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    openssl \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy package files first for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY .eslintrc.cjs ./
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies (separate layer for better caching)
ENV HUSKY=0 \
    PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN pnpm install --frozen-lockfile --prefer-offline

# Copy source code (this layer changes frequently)
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
FROM node:20.18.0-bookworm-slim AS runner

# Install runtime dependencies only
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    openssl \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# Create non-root user
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --shell /bin/bash nestjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    NODE_OPTIONS="--enable-source-maps"

# Copy only production artifacts
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health/live || exit 1

# Start application
CMD ["node", "--enable-source-maps", "dist/main.js"]


