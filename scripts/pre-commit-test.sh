#!/usr/bin/env bash
set -euo pipefail

# Script to run quick tests in pre-commit
# Focuses on unit tests only (fast) to avoid blocking commits

echo "Running quick unit tests..."

# Check if we're in a Docker environment
if command -v docker &> /dev/null && docker compose ps &> /dev/null; then
  # Docker-first: use tools container
  if docker compose run --rm -T tools pnpm test 2>&1 | grep -q "PASS"; then
    echo "Tests passed"
    exit 0
  else
    echo "Tests failed"
    exit 1
  fi
else
  # Fallback: try locally (if pnpm is installed)
  if command -v pnpm &> /dev/null; then
    pnpm test
  else
    echo "Warning: Docker not available and pnpm not found. Skipping tests."
    exit 0
  fi
fi
