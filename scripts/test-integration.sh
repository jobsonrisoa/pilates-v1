#!/bin/bash
set -e

echo "Starting integration tests..."

# Ensure test containers are running
if ! docker compose -f docker-compose.test.yml ps mysql-test redis-test | grep -q "Up"; then
  echo "Starting test containers..."
  docker compose -f docker-compose.test.yml up -d mysql-test redis-test
  echo "Waiting for containers to be ready..."
  sleep 10
fi

# Run integration tests with proper network access
# Use host network or connect to test network
export DATABASE_URL="mysql://root:test@localhost:3307/pilates_test"

# Run integration tests - connect tools container to test network
docker compose -f docker-compose.test.yml run --rm \
  -e DATABASE_URL=mysql://root:test@mysql-test:3306/pilates_test \
  api-test sh -c "pnpm --filter @pilates/api test:integration" || \
docker compose run --rm \
  --network cry_test-network \
  -e DATABASE_URL=mysql://root:test@mysql-test:3306/pilates_test \
  tools sh -c "cd /repo && pnpm --filter @pilates/api test:integration"

