.PHONY: help dev dev-build down clean logs \
	shell-api shell-web shell-mysql shell-redis \
	migrate migrate-prod seed db-reset db-studio \
	test test-watch test-cov test-e2e test-int \
	lint format typecheck

# Colors for output
CYAN := \033[36m
RESET := \033[0m

help: ## Show this help
	@echo "$(CYAN)Available commands:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}'

# =============================================
# DEVELOPMENT
# =============================================

dev: ## Start development environment
	docker compose up

dev-build: ## Start environment with image rebuild
	docker compose up --build

down: ## Stop all containers
	docker compose down

clean: ## Remove containers, volumes and unused images
	docker compose down -v --remove-orphans
	docker system prune -f

logs: ## Show logs from all services
	docker compose logs -f

logs-api: ## Show API logs
	docker compose logs -f api

logs-web: ## Show Web logs
	docker compose logs -f web

# =============================================
# SHELLS
# =============================================

shell-api: ## Access API container shell
	docker compose exec api sh

shell-web: ## Access Web container shell
	docker compose exec web sh

shell-mysql: ## Access MySQL CLI
	docker compose exec mysql mysql -u pilates -ppilates pilates_dev

shell-redis: ## Access Redis CLI
	docker compose exec redis redis-cli

# =============================================
# DATABASE
# =============================================

migrate: ## Run Prisma migrations (dev)
	docker compose exec api pnpm prisma migrate dev

migrate-prod: ## Run Prisma migrations (production)
	docker compose exec api pnpm prisma migrate deploy

seed: ## Populate database with development data
	docker compose exec api pnpm prisma db seed

db-reset: ## Reset database (CAUTION!)
	docker compose exec api pnpm prisma migrate reset --force

db-studio: ## Open Prisma Studio
	docker compose exec api pnpm prisma studio

# =============================================
# TESTS
# =============================================

test: ## Run all tests (unit + integration)
	@echo "$(CYAN)Running all tests...$(RESET)"
	docker compose run --rm tools pnpm --filter @pilates/api test
	docker compose run --rm tools pnpm --filter @pilates/web test

test-api: ## Run API unit tests
	docker compose run --rm tools pnpm --filter @pilates/api test

test-web: ## Run Web unit tests
	docker compose run --rm tools pnpm --filter @pilates/web test

test-watch: ## Run tests in watch mode (api)
	docker compose exec api pnpm test:watch

test-cov: ## Run all tests with coverage
	@echo "$(CYAN)Running tests with coverage...$(RESET)"
	docker compose run --rm tools pnpm --filter @pilates/api test:cov
	docker compose run --rm tools pnpm --filter @pilates/web test:cov

test-cov-api: ## Run API tests with coverage
	docker compose run --rm tools pnpm --filter @pilates/api test:cov

test-cov-web: ## Run Web tests with coverage
	docker compose run --rm tools pnpm --filter @pilates/web test:cov

test-e2e: ## Run E2E tests (web)
	docker compose exec web pnpm test:e2e

test-int: ## Run integration tests (api)
	docker compose run --rm tools pnpm --filter @pilates/api test:integration

test-all: test test-int test-cov ## Run all tests including integration and coverage

# =============================================
# QUALITY
# =============================================

lint: ## Run linter on all projects
	docker compose exec api pnpm lint
	docker compose exec web pnpm lint

format: ## Format code in all projects
	docker compose exec api pnpm format
	docker compose exec web pnpm format

typecheck: ## Check TypeScript types
	docker compose exec api pnpm typecheck
	docker compose exec web pnpm typecheck
