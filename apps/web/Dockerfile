# =============================================
# STAGE 1: Dependencies
# =============================================
FROM node:20.18.0-alpine AS deps

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy package files first for better layer caching
COPY pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/package.json

# Install dependencies
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
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @pilates/web build

# =============================================
# STAGE 3: Runner (standalone)
# =============================================
FROM node:20.18.0-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--enable-source-maps"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --gid nodejs --shell /bin/sh nextjs

# Copy only production artifacts
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set runtime environment
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start application
CMD ["node", "--enable-source-maps", "server.js"]


