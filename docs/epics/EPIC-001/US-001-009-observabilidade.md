# US-001-009: Logging e Métricas

##  Informações

| Campo            | Valor              |
| ---------------- | ------------------ |
| **ID**           | US-001-009         |
| **Épico**        | EPIC-001           |
| **Título**       | Logging e Métricas |
| **Estimativa**   | 3 horas            |
| **Prioridade**   | 🟡 Média           |
| **Dependências** | US-001-002         |
| **Status**       | Backlog         |

---

##  User Story

**Como** desenvolvedor/ops  
**Quero** logging estruturado e métricas  
**Para** debugar e monitorar o sistema

---

##  Objetivos

1. Configurar Pino para logs estruturados
2. Configurar endpoint /metrics (Prometheus)
3. Redact de dados sensíveis
4. Configurar Sentry para erros

---

##  Critérios de Aceite

- [ ] Logs em JSON em produção
- [ ] Logs pretty em desenvolvimento
- [ ] /metrics endpoint funcionando
- [ ] Dados sensíveis redactados
- [ ] Sentry capturando erros (prod)

---

##  Prompt para Implementação

```markdown
## Contexto

Backend NestJS. Preciso de observabilidade básica para
desenvolvimento e produção.

## Tarefa

Configure:

### 1. Pino Logger

- nestjs-pino
- JSON em prod, pretty em dev
- Redact: password, token, cpf, authorization
- Request/response logging

### 2. Prometheus Metrics

- @willsoto/nestjs-prometheus
- /metrics endpoint
- Métricas padrão (http, nodejs)
- Métricas customizadas

### 3. Sentry (opcional)

- @sentry/node
- Apenas em produção
- Filter de erros 4xx
```

---

##  Implementação

### Pino Logger Module

```typescript
// src/shared/infrastructure/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.passwordHash',
            'req.body.cpf',
            'req.body.token',
          ],
          censor: '[REDACTED]',
        },
        customProps: () => ({
          service: 'pilates-api',
          environment: process.env.NODE_ENV,
        }),
      },
    }),
  ],
})
export class LoggerModule {}
```

### Metrics Module

```typescript
// src/shared/infrastructure/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'path', 'status'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration',
      labelNames: ['method', 'path'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    }),
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}
```

---

##  Checklist de Verificação

- [ ] Logs aparecem formatados
- [ ] /metrics retorna métricas
- [ ] Dados sensíveis não aparecem nos logs

---

##  Próxima User Story

→ [US-001-010: Documentação e Seed](./US-001-010-documentacao.md)
