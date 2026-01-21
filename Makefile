.PHONY: help dev dev-build down clean logs \
	shell-api shell-web shell-mysql shell-redis \
	migrate migrate-prod seed db-reset db-studio \
	test test-watch test-cov test-e2e test-int \
	lint format typecheck

# Cores para output
CYAN := \033[36m
RESET := \033[0m

help: ## Mostra esta ajuda
	@echo "$(CYAN)Comandos disponíveis:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'

# =============================================
# DESENVOLVIMENTO
# =============================================

dev: ## Inicia ambiente de desenvolvimento
	docker compose up

dev-build: ## Inicia ambiente com rebuild das imagens
	docker compose up --build

down: ## Para todos os containers
	docker compose down

clean: ## Remove containers, volumes e imagens não utilizadas
	docker compose down -v --remove-orphans
	docker system prune -f

logs: ## Mostra logs de todos os serviços
	docker compose logs -f

logs-api: ## Mostra logs da API
	docker compose logs -f api

logs-web: ## Mostra logs do Web
	docker compose logs -f web

# =============================================
# SHELLS
# =============================================

shell-api: ## Acessa shell do container da API
	docker compose exec api sh

shell-web: ## Acessa shell do container Web
	docker compose exec web sh

shell-mysql: ## Acessa MySQL CLI
	docker compose exec mysql mysql -u pilates -ppilates pilates_dev

shell-redis: ## Acessa Redis CLI
	docker compose exec redis redis-cli

# =============================================
# BANCO DE DADOS (quando o backend estiver implementado)
# =============================================

migrate: ## Roda migrations do Prisma
	docker compose exec api pnpm prisma migrate dev

migrate-prod: ## Roda migrations em produção
	docker compose exec api pnpm prisma migrate deploy

seed: ## Popula banco com dados de desenvolvimento
	docker compose exec api pnpm prisma db seed

db-reset: ## Reseta banco de dados (CUIDADO!)
	docker compose exec api pnpm prisma migrate reset --force

db-studio: ## Abre Prisma Studio
	docker compose exec api pnpm prisma studio

# =============================================
# TESTES
# =============================================

test: ## Roda todos os testes
	docker compose exec api pnpm test
	docker compose exec web pnpm test

test-watch: ## Roda testes em modo watch (api)
	docker compose exec api pnpm test:watch

test-cov: ## Roda testes com cobertura
	docker compose exec api pnpm test:cov
	docker compose exec web pnpm test:cov

test-e2e: ## Roda testes E2E (web)
	docker compose exec web pnpm test:e2e

test-int: ## Roda testes de integração (api)
	docker compose exec api pnpm test:integration

# =============================================
# QUALIDADE
# =============================================

lint: ## Roda linter em todos os projetos
	docker compose exec api pnpm lint
	docker compose exec web pnpm lint

format: ## Formata código em todos os projetos
	docker compose exec api pnpm format
	docker compose exec web pnpm format

typecheck: ## Verifica tipos TypeScript
	docker compose exec api pnpm typecheck
	docker compose exec web pnpm typecheck

