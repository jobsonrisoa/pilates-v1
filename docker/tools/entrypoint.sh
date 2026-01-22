#!/usr/bin/env sh
set -eu

cd /repo

# pnpm via Corepack (docker-first; no tooling required on the host)
corepack enable >/dev/null 2>&1 || true

# Persist pnpm store across runs (mounted volume)
pnpm config set store-dir /pnpm-store >/dev/null 2>&1 || true

exec "$@"



