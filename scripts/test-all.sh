#!/usr/bin/env bash
set -euo pipefail

# Script para executar todos os testes do projeto
# Uso: ./scripts/test-all.sh [--coverage] [--watch] [--integration] [--e2e]

COVERAGE=false
WATCH=false
INTEGRATION=false
E2E=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --coverage)
      COVERAGE=true
      shift
      ;;
    --watch)
      WATCH=true
      shift
      ;;
    --integration)
      INTEGRATION=true
      shift
      ;;
    --e2e)
      E2E=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--coverage] [--watch] [--integration] [--e2e]"
      exit 1
      ;;
  esac
done

echo "🧪 Executando testes do projeto Pilates System"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run tests
run_test() {
  local workspace=$1
  local test_cmd=$2
  local name=$3

  echo -e "${YELLOW}📦 Testando: ${name}${NC}"
  if docker compose run --rm tools pnpm --filter "${workspace}" ${test_cmd}; then
    echo -e "${GREEN}✅ ${name} passou${NC}"
    echo ""
    return 0
  else
    echo -e "${RED}❌ ${name} falhou${NC}"
    echo ""
    return 1
  fi
}

# Function to run quality checks
run_quality() {
  local cmd=$1
  local name=$2

  echo -e "${YELLOW}🔍 ${name}${NC}"
  if docker compose run --rm tools pnpm ${cmd}; then
    echo -e "${GREEN}✅ ${name} passou${NC}"
    echo ""
    return 0
  else
    echo -e "${RED}❌ ${name} falhou${NC}"
    echo ""
    return 1
  fi
}

FAILED=0

# 1. Lint
if ! run_quality "lint" "ESLint"; then
  FAILED=$((FAILED + 1))
fi

# 2. Format check
if ! run_quality "format:check" "Prettier"; then
  FAILED=$((FAILED + 1))
fi

# 3. Type check
if ! run_quality "typecheck" "TypeScript"; then
  FAILED=$((FAILED + 1))
fi

# 4. Unit tests
if [ "$WATCH" = true ]; then
  echo -e "${YELLOW}👀 Modo watch ativado${NC}"
  echo "Pressione Ctrl+C para sair"
  docker compose run --rm tools pnpm --filter @pilates/api test:watch
else
  if [ "$COVERAGE" = true ]; then
    if ! run_test "@pilates/api" "test:cov" "API (com coverage)"; then
      FAILED=$((FAILED + 1))
    fi
    if ! run_test "@pilates/web" "test:cov" "Web (com coverage)"; then
      FAILED=$((FAILED + 1))
    fi
  else
    if ! run_test "@pilates/api" "test" "API (unitários)"; then
      FAILED=$((FAILED + 1))
    fi
    if ! run_test "@pilates/web" "test" "Web (unitários)"; then
      FAILED=$((FAILED + 1))
    fi
  fi
fi

# 5. Integration tests (if requested)
if [ "$INTEGRATION" = true ]; then
  echo -e "${YELLOW}🔄 Iniciando serviços para testes de integração...${NC}"
  docker compose up -d mysql redis
  sleep 5

  if ! run_test "@pilates/api" "test:integration" "API (integração)"; then
    FAILED=$((FAILED + 1))
  fi
fi

# 6. E2E tests (if requested)
if [ "$E2E" = true ]; then
  echo -e "${YELLOW}🌐 Iniciando stack completa para testes E2E...${NC}"
  docker compose up -d
  sleep 10

  if ! run_test "@pilates/web" "test:e2e" "Web (E2E)"; then
    FAILED=$((FAILED + 1))
  fi
fi

# Summary
echo "=============================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
  exit 0
else
  echo -e "${RED}❌ ${FAILED} teste(s) falharam${NC}"
  exit 1
fi

