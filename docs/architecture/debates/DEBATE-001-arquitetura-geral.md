# Debate Arquitetural #001 - Arquitetura Geral do Sistema

**Data:** 21/01/2026  
**Participantes:**

- 🏗️ **Dr. Carlos Mendes** - Arquiteto de Software Sênior (15 anos de experiência)
-  **Ana Rodrigues** - Especialista em DevOps e Infraestrutura
-  **Roberto Silva** - Especialista em Custos e Otimização Cloud
-  **Marina Costa** - Especialista em Qualidade e Testes
-  **Felipe Santos** - Especialista em Segurança
-  **Juliana Oliveira** - Especialista em Observabilidade

---

## Contexto

Sistema de gestão para academia de Pilates e Fisioterapia com módulos de:

- Autenticação e RBAC
- Gestão de Alunos e Professores
- Agendamento de Aulas
- Financeiro (integração Sicoob)
- Contratos Digitais
- Estoque e Vendas
- Relatórios

**Restrições definidas pelo cliente:**

- NestJS + Next.js
- DDD + TDD
- Docker (sem instalação local)
- Custo inicial baixo
- Preparado para escalar

---

## Tópico 1: Monolito vs Microserviços

### 🏗️ Dr. Carlos Mendes (Arquiteto):

> "Para um sistema deste porte, com uma equipe que imagino ser pequena inicialmente, recomendo fortemente começar com um **Monolito Modular**.
>
> A estrutura do NestJS já favorece isso com seus módulos. Podemos organizar o código em bounded contexts do DDD sem a complexidade operacional de microserviços.
>
> O padrão que sugiro é:
>
> ```
> src/
>   modules/
>     auth/
>     students/
>     teachers/
>     classes/
>     financial/
>     inventory/
>     reports/
>   shared/
>     domain/
>     infrastructure/
> ```
>
> Cada módulo é isolado, com seu próprio domínio, mas compartilha o mesmo deploy. Quando precisarmos escalar, podemos extrair módulos para serviços separados."

###  Ana Rodrigues (DevOps):

> "Concordo totalmente, Carlos. Microserviços trariam complexidade operacional enorme:
>
> - Múltiplos deploys
> - Service discovery
> - Orquestração (Kubernetes seria necessário)
> - Distributed tracing obrigatório
>
> Com monolito modular, conseguimos:
>
> - Um único container Docker
> - CI/CD simples
> - Deploy em qualquer VPS barata
> - Logs centralizados naturalmente
>
> Minha sugestão é usar **Docker Compose** para desenvolvimento e um único Dockerfile otimizado para produção."

###  Roberto Silva (Custos):

> "Do ponto de vista financeiro, a diferença é brutal:
>
> **Microserviços (estimativa mensal):**
>
> - Kubernetes (EKS/GKE): $150-300
> - Load Balancers múltiplos: $50+
> - Múltiplas instâncias: $200+
> - **Total: ~$400-550/mês mínimo**
>
> **Monolito Modular:**
>
> - VPS única (4GB RAM): $20-40
> - Banco de dados gerenciado: $15-30
> - **Total: ~$35-70/mês**
>
> A economia é de 80-90% começando com monolito!"

###  Marina Costa (Qualidade):

> "Para TDD, o monolito modular também é mais vantajoso:
>
> - Testes de integração mais simples
> - Não precisa mockar chamadas de rede entre serviços
> - Setup de ambiente de teste unificado
> - Red-Green-Refactor com feedback mais rápido
>
> Podemos ter testes unitários por módulo e testes de integração que validam a comunicação entre módulos, tudo no mesmo processo."

** DECISÃO: Monolito Modular com DDD**

---

## Tópico 2: Estratégia de Banco de Dados

### 🏗️ Dr. Carlos Mendes:

> "O requisito menciona MySQL, o que é adequado. Para DDD, sugiro usar o padrão Repository com Prisma ou TypeORM.
>
> Porém, há uma decisão importante: **um banco único ou banco por bounded context?**
>
> Minha recomendação: **banco único com schemas/prefixos lógicos**. Isso facilita:
>
> - Transações cross-domain quando necessário
> - Backup único
> - Menos custo
> - Migrations mais simples
>
> Quando (e se) migrarmos para microserviços, cada serviço pode ter seu próprio schema ou banco."

###  Ana Rodrigues:

> "Para ORM, sugiro **Prisma** ao invés de TypeORM:
>
> - Type-safety superior
> - Migrations mais previsíveis
> - Schema declarativo
> - Integração melhor com NestJS moderno
> - Performance de queries melhor
>
> O Prisma também facilita muito o TDD porque gera um client type-safe."

###  Roberto Silva:

> "MySQL gerenciado em cloud:
>
> - AWS RDS: ~$15/mês (db.t3.micro)
> - PlanetScale: gratuito até 5GB
> - DigitalOcean: ~$15/mês
> - Railway: ~$5-20/mês
>
> Para início, **Railway ou PlanetScale** são ótimas opções custo-benefício."

###  Felipe Santos (Segurança):

> "Independente da escolha, precisamos garantir:
>
> - Conexões via SSL sempre
> - Credenciais em variáveis de ambiente (nunca no código)
> - Prepared statements (Prisma já faz isso por padrão)
> - Backup automático diário
> - Audit logs para operações sensíveis (LGPD)"

** DECISÃO: MySQL único com Prisma ORM**

---

## Tópico 3: Hospedagem e Infraestrutura

###  Roberto Silva:

> "Vamos analisar as opções de hospedagem para baixo custo:
>
> **Opção 1 - VPS Tradicional (Recomendada para início):**
>
> - DigitalOcean Droplet: $12-24/mês
> - Hetzner Cloud: €4-8/mês (mais barato!)
> - Vultr: $12-24/mês
>
> **Opção 2 - PaaS:**
>
> - Railway: ~$5-20/mês (free tier generoso)
> - Render: free tier + $7/mês
> - Fly.io: free tier + pay-as-you-go
>
> **Opção 3 - AWS (mais caro, mais controle):**
>
> - EC2 t3.micro: ~$10/mês
> - Lightsail: $5-10/mês
>
> Minha recomendação: **Railway para desenvolvimento/staging e Hetzner/DigitalOcean para produção**."

###  Ana Rodrigues:

> "Para manter tudo em Docker e simplificar deploy, sugiro:
>
> **Desenvolvimento:**
>
> - Docker Compose com hot-reload
> - Volumes para persistência local
> - Network isolada
>
> **Produção:**
>
> - Docker Compose em VPS (início)
> - Traefik como reverse proxy (SSL automático)
> - Watchtower para atualizações automáticas
>
> **Evolução futura:**
>
> - Quando precisar escalar: Kubernetes ou Docker Swarm
> - Ou manter simples com múltiplas VPS + Load Balancer"

### 🏗️ Dr. Carlos Mendes:

> "Importante: mesmo usando VPS simples, a arquitetura interna deve ser cloud-ready:
>
> - Stateless (sessões em Redis)
> - Arquivos em S3/MinIO
> - Logs estruturados (JSON)
> - Health checks
> - Graceful shutdown
>
> Isso permite migrar para qualquer cloud depois sem reescrever código."

** DECISÃO: Railway (dev/staging) + Hetzner Cloud (produção) com Docker Compose**

---

## Tópico 4: Observabilidade

###  Juliana Oliveira:

> "Observabilidade é crítica, mas precisa ser proporcional ao tamanho do sistema. Para um monolito inicial, sugiro o stack mais simples possível:
>
> **Logging:**
>
> - Winston ou Pino (estruturado, JSON)
> - Em produção: enviar para serviço gratuito
> - Opções: Logtail (gratuito até 1GB/mês), Grafana Cloud, Better Stack
>
> **Métricas:**
>
> - Prometheus + Grafana (self-hosted)
> - Ou usar serviço gratuito como Grafana Cloud
>
> **Tracing:**
>
> - Para monolito, não é crítico inicialmente
> - OpenTelemetry quando precisar
>
> **APM Simples:**
>
> - New Relic (free tier generoso)
> - Sentry para erros (free tier)"

###  Ana Rodrigues:

> "Concordo com a Juliana. Minha stack de observabilidade recomendada:
>
> **Fase 1 (MVP):**
>
> - Logs: Pino → stdout → Docker logs
> - Erros: Sentry (free tier)
> - Uptime: UptimeRobot ou Better Stack (gratuito)
>
> **Fase 2:**
>
> - Adicionar Prometheus + Grafana (self-hosted)
> - Métricas de negócio
>
> **Fase 3 (se necessário):**
>
> - OpenTelemetry
> - Distributed tracing"

###  Roberto Silva:

> "Custos de observabilidade:
>
> **Gratuito/Barato:**
>
> - Sentry: free até 5K erros/mês
> - Logtail: free até 1GB/mês
> - UptimeRobot: free 50 monitors
> - Grafana Cloud: free tier generoso
>
> **Self-hosted (custo de VPS apenas):**
>
> - Prometheus + Grafana em container
> - ~200MB RAM extra
>
> Recomendo começar 100% gratuito e evoluir conforme necessidade."

** DECISÃO: Sentry (erros) + Pino (logs) + Prometheus/Grafana (métricas) - tudo gratuito/self-hosted**

---

## Tópico 5: CI/CD

###  Ana Rodrigues:

> "CI/CD precisa ser simples mas robusto. Minha recomendação:
>
> **GitHub Actions** (gratuito para repos públicos, 2000 min/mês privados):
>
> ```yaml
> Pipeline:
> 1. Lint + Type Check
> 2. Testes Unitários
> 3. Testes de Integração
> 4. Build Docker
> 5. Push para Registry
> 6. Deploy (staging automático, prod manual)
> ```
>
> **Registry:**
>
> - GitHub Container Registry (gratuito)
> - Ou DockerHub (1 repo privado grátis)
>
> **Deploy:**
>
> - SSH + Docker Compose pull
> - Ou Webhook para Watchtower
> - Zero-downtime com health checks"

###  Marina Costa:

> "Para TDD funcionar no CI, precisamos de:
>
> 1. **Testes rápidos** - devem rodar em < 5 minutos
> 2. **Banco de teste** - container MySQL efêmero
> 3. **Coverage obrigatório** - mínimo 80%
> 4. **Testes em paralelo** - Jest com workers
>
> Pipeline sugerido:
>
> ````
> [Push] → Lint → Unit Tests (paralelo) → Integration Tests → Build
>           ↓           ↓                      ↓
>        Fail fast   Coverage ≥ 80%      Banco efêmero
> ```"
> ````

###  Felipe Santos:

> "Segurança no CI/CD:
>
> - Secrets no GitHub Secrets
> - Scan de vulnerabilidades (Snyk, Trivy)
> - Análise estática (ESLint security rules)
> - SAST básico
> - Dependabot ativado"

** DECISÃO: GitHub Actions + GitHub Container Registry + Deploy via SSH**

---

## Tópico 6: Frontend (Next.js)

### 🏗️ Dr. Carlos Mendes:

> "Next.js é uma escolha sólida. Decisões a tomar:
>
> **App Router vs Pages Router:**
>
> - App Router (novo) - mais moderno, server components
> - Recomendo App Router para projeto novo
>
> **Renderização:**
>
> - Para painel admin: SSR ou CSR (autenticado)
> - Relatórios: SSR com cache
> - Dashboard: CSR com SWR/React Query
>
> **Estrutura:**
>
> ````
> app/
>   (auth)/
>     login/
>   (dashboard)/
>     alunos/
>     professores/
>     aulas/
>     financeiro/
>   api/  # BFF se necessário
> ```"
> ````

###  Roberto Silva:

> "Deploy do Next.js:
>
> - **Vercel**: gratuito para projetos pessoais (limitações comerciais)
> - **Self-hosted**: Node.js no mesmo servidor
> - **Static export**: se não precisar de SSR
>
> Recomendo **self-hosted** junto com o backend para simplificar e economizar."

###  Ana Rodrigues:

> "Para desenvolvimento local com Docker:
>
> ```yaml
> services:
>   frontend:
>     build: ./frontend
>     volumes:
>       - ./frontend:/app
>       - /app/node_modules
>     ports:
>       - '3000:3000'
>     environment:
>       - NEXT_PUBLIC_API_URL=http://backend:3001
> ```
>
> Hot-reload funcionando, sem instalar Node.js localmente."

** DECISÃO: Next.js App Router, self-hosted junto com backend**

---

## Tópico 7: Preparação para Escalar

### 🏗️ Dr. Carlos Mendes:

> "Mesmo sendo monolito, precisamos de padrões que facilitem evolução:
>
> **1. Eventos de Domínio:**
>
> - Usar EventEmitter do NestJS
> - Módulos se comunicam via eventos, não chamadas diretas
> - Quando escalar: trocar por RabbitMQ/Redis Pub-Sub
>
> **2. CQRS Light:**
>
> - Separar queries de commands
> - Read models específicos para relatórios
> - Facilita otimização de leitura depois
>
> **3. Interfaces bem definidas:**
>
> - Contratos entre módulos
> - Fácil extrair para API HTTP depois
>
> **4. Stateless:**
>
> - Sessões em Redis
> - Arquivos em S3/MinIO
> - Cache distribuído"

###  Ana Rodrigues:

> "Infraestrutura preparada para escalar:
>
> **Agora:**
>
> ```
> [Traefik] → [App Container] → [MySQL]
>                   ↓
>               [Redis]
> ```
>
> **Depois (quando precisar):**
>
> ```
> [Traefik/LB] → [App 1] ← → [Redis Cluster]
>            ↘ [App 2] ← → [MySQL Primary]
>            ↘ [App N]         ↓
>                         [MySQL Replica]
> ```
>
> Mesma imagem Docker, só escalar horizontalmente."

** DECISÃO: Eventos de domínio + Stateless + Redis desde o início**

---

## Resumo das Decisões

| Tópico             | Decisão                        |
| ------------------ | ------------------------------ |
| Arquitetura        | Monolito Modular com DDD       |
| Backend            | NestJS com módulos isolados    |
| Frontend           | Next.js App Router             |
| Banco de Dados     | MySQL + Prisma ORM             |
| Hospedagem Dev     | Railway / Docker Compose local |
| Hospedagem Prod    | Hetzner Cloud / DigitalOcean   |
| CI/CD              | GitHub Actions                 |
| Container Registry | GitHub Container Registry      |
| Logs               | Pino (estruturado)             |
| Erros              | Sentry (free tier)             |
| Métricas           | Prometheus + Grafana           |
| Cache/Sessions     | Redis                          |
| Reverse Proxy      | Traefik                        |
| Arquivos           | MinIO (dev) / S3 (prod)        |

---

## Próximos Passos

1.  Criar ADRs para cada decisão
2.  Criar PRD consolidado
3.  Definir estrutura de pastas do projeto
4.  Criar docker-compose.yml base
5.  Iniciar desenvolvimento do MVP

---

_Documento gerado a partir do debate arquitetural realizado em 21/01/2026_
