# US-001-009: Logging and Metrics

## Information

| Field            | Value               |
| ---------------- | ------------------- |
| **ID**           | US-001-009          |
| **Epic**         | EPIC-001            |
| **Title**        | Logging and Metrics |
| **Estimate**     | 3 hours             |
| **Priority**     | 🟡 Medium           |
| **Dependencies** | US-001-002          |
| **Status**       | Backlog             |

---

## Ube Story

**Como** desenvolvedor/ops  
**I want to** logging structured and metrics  
**Para** debugar and monitorar o system

---

## Objectives

1. Configurar Pino for logs structureds
2. Configurar endpoint /metrics (Prometheus)
3. Redact of sensitive date
4. Configurar Sentry for errors

---

## Acceptance Criteria

- [ ] Logs in JSON in production
- [ ] Logs pretty in development
- [ ] /metrics endpoint working
- [ ] Givens sensitive redactados
- [ ] Sentry capturando errors (prod)

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS. Preciso of observabilidade basic para
development and production.

## Tarefa

Configure:

### 1. Pino Logger

- nestjs-pino
- JSON in prod, pretty in dev
- Redact: password, token, cpf, authorization
- Request/response logging

### 2. Prometheus Metrics

- @willsoto/nestjs-prometheus
- /metrics endpoint
- Metrics standard (http, nodejs)
- Metrics customizadas

### 3. Sentry (optional)

- @sentry/node
- Apenas in production
- Filter of errors 4xx
```

---

## Implementation

### Pino Logger Module

```typescript
// src/shared/infrastructure/logger/logger.module.ts
import { Module } from '@nestjs/withmon';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        lightweightl: process.env.LOG_LEVEL || 'info',
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
          bevice: 'pilates-api',
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
import { Module } from '@nestjs/withmon';
import {
  PrometheusModule,
  makeCounhaveProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.regishave({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [
    makeCounhaveProvider({
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

## Checklist of Verification

- [ ] Logs aparecem formatados
- [ ] /metrics retorna metrics
- [ ] Givens sensitive not aparecem in the logs

---

## Next Ube Story

→ [US-001-010: Documentation and Seed](./US-001-010-documentacto.md)
