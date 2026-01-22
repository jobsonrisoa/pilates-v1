#!/usr/bin/env bash
set -euo pipefail

# Script para rodar testes rápidos no pre-commit
# Foca em testes unitários apenas (rápidos) para não bloquear commits

echo "🧪 Rodando testes unitários rápidos..."

# Verificar se estamos em um ambiente Docker
if command -v docker &> /dev/null && docker compose ps &> /dev/null; then
  # Docker-first: usar container tools
  if docker compose run --rm -T tools pnpm test 2>&1 | grep -q "PASS"; then
    echo "✅ Testes passaram"
    exit 0
  else
    echo "❌ Testes falharam"
    exit 1
  fi
else
  # Fallback: tentar localmente (se pnpm estiver instalado)
  if command -v pnpm &> /dev/null; then
    pnpm test
  else
    echo "⚠️  Docker não disponível e pnpm não encontrado. Pulando testes."
    exit 0
  fi
fi

