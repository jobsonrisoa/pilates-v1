#!/bin/bash
set -e

echo "Setting up E2E test environment..."

# Check if Playwright browsers are installed
if [ ! -d "$HOME/.cache/ms-playwright" ] && [ ! -d "/root/.cache/ms-playwright" ]; then
  echo "Installing Playwright browsers..."
  docker compose run --rm tools pnpm --filter @pilates/web test:e2e:install
else
  echo "Playwright browsers already installed"
fi

echo "Starting services for E2E tests..."
docker compose up -d api web mysql redis

echo "Waiting for services to be ready..."
sleep 10

# Check if API is ready
until curl -s http://localhost:3001/health/live > /dev/null; do
  echo "Waiting for API..."
  sleep 2
done

# Check if Web is ready
until curl -s http://localhost:3000 > /dev/null; do
  echo "Waiting for Web..."
  sleep 2
done

echo "E2E environment ready!"
echo ""
echo "Run E2E tests with:"
echo "  docker compose run --rm tools pnpm --filter @pilates/web test:e2e"

