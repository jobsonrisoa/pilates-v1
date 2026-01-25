#!/bin/bash
set -e

echo "Starting E2E tests..."

# Check if Playwright browsers are installed
if [ ! -d "apps/web/node_modules/.cache/ms-playwright" ] && [ ! -d "$HOME/.cache/ms-playwright" ]; then
  echo "Installing Playwright browsers..."
  docker compose run --rm tools sh -c "cd /repo && pnpm --filter @pilates/web exec playwright install chromium"
fi

# Start web server if not running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "Starting web server..."
  docker compose up -d web
  echo "Waiting for web server to be ready..."
  sleep 10
fi

# Run E2E tests
docker compose run --rm tools sh -c "cd /repo && pnpm --filter @pilates/web test:e2e:ci"

