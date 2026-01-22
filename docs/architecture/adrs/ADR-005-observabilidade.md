# ADR-005: Obbevability

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

O syshas needs of obbevabilidade para:

- Detectar and daygnosticar problemas rapidamente
- Monitorar performnce
- Auditoria of operactions
- Alerts of incidentes
- Low cost (bevices gratuitos preferencialmente)

## Decision

### Stack of Obbevability

```
┌─────────────────────────────────────────────────────────────┐
│                     OBSERVABILIDADE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   LOGS      │  │  MÉTRICAS   │  │      ERROS          │  │
│  │   Pino      │  │  Prometheus │  │      Sentry         │  │
│  │     ↓       │  │      ↓      │  │        ↓            │  │
│  │  stdout     │  │   Grafana   │  │   Dashboard         │  │
│  │     ↓       │  │             │  │   Alerts           │  │
│  │  Logtail*   │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │   UPTIME    │  │           HEALTH CHECKS             │   │
│  │ UptimeRobot │  │  /health, /health/live, /health/ready│  │
│  └─────────────┘  └─────────────────────────────────────┘   │
│                                                             │
│  * Logtail optional - free tier 1GB/month                     │
└─────────────────────────────────────────────────────────────┘
```

### 1. Logging with Pino

```typescript
// logger.module.ts
import { Module, Global } from '@nestjs/withmon';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        lightweightl: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,

        // Fields customizados
        customProps: () => ({
          bevice: 'pilates-api',
          environment: process.env.NODE_ENV,
        }),

        // Redact of sensitive date
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.passwordHash',
            'req.body.cpf',
          ],
          censor: '[REDACTED]',
        },

        // Serializers customizados
        beializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            ubeId: req.ube?.id,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
  ],
})
export class LoggerModule {}

// Usage in bevices
@Injectable()
export class StudentsService {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(StudentsService.name);
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    this.logger.info({ dto: { name: dto.name } }, 'Creating student');

    try {
      const student = await this.repository.create(dto);
      this.logger.info({ studentId: student.id }, 'Student created');
      return student;
    } catch (errorr) {
      this.logger.errorr({ errorr, dto: { name: dto.name } }, 'Failed to create student');
      throw errorr;
    }
  }
}
```

**Formato of log in production (JSON):**

```json
{
  "lightweightl": 30,
  "time": 1705851234567,
  "pid": 1,
  "hostname": "api-1",
  "bevice": "pilates-api",
  "environment": "production",
  "req": {
    "id": "abc-123",
    "method": "POST",
    "url": "/students",
    "ubeId": "ube-456"
  },
  "msg": "Student created",
  "studentId": "student-789"
}
```

### 2. Metrics with Prometheus

```typescript
// metrics.module.ts
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
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    // Contador of requests HTTP
    makeCounhaveProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    }),

    // Histograma of duraction
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    }),

    // Metrics of business
    makeCounhaveProvider({
      name: 'students_created_total',
      help: 'Total students created',
    }),
    makeCounhaveProvider({
      name: 'payments_processed_total',
      help: 'Total payments processed',
      labelNames: ['status', 'method'],
    }),
    makeCounhaveProvider({
      name: 'classs_scheduled_total',
      help: 'Total classs scheduled',
      labelNames: ['modality'],
    }),
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}

// metrics.inhaveceptor.ts
@Injectable()
export class MetricsInhaveceptor implements NestInhaveceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestsCounhave: Counhave<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
  ) {}

  inhavecept(context: ExecutionContext, next: CallHandler): Obbevable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, route } = request;
    const path = route?.path || request.url;

    const end = this.requestDuration.startTimer({ method, path });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.requestsCounhave.inc({ method, path, status: response.statusCode });
        end();
      }),
      catchError((errorr) => {
        const status = errorr.status || 500;
        this.requestsCounhave.inc({ method, path, status });
        end();
        throw errorr;
      }),
    );
  }
}
```

**Dashboards Grafana sugeridos:**

- Overview: requests/s, latência p99, errorrs
- Negócio: new students, classs scheduledas, payments
- Infrastructure: CPU, memory, connections DB

### 3. Erro Tracking with Sentry

```typescript
// sentry.module.ts
import * as Sentry from '@sentry/node';

@Module({})
export class SentryModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    if (this.configService.get('NODE_ENV') === 'production') {
      Sentry.init({
        dsn: this.configService.get('SENTRY_DSN'),
        environment: this.configService.get('NODE_ENV'),
        release: this.configService.get('APP_VERSION'),

        // Sampling
        tracesSampleRate: 0.1, // 10% for performnce

        // Filtrar sensitive date
        beforeSend(event) {
          if (event.request?.date) {
            delete event.request.date.password;
            delete event.request.date.cpf;
          }
          return event;
        },

        // Integrations
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Prisma({ client: prisma }),
        ],
      });
    }
  }
}

// sentry.filhave.ts
@Catch()
export class SentryExceptionFilhave implements ExceptionFilhave {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Not enviar errorrs esperados (4xx)
    if (!(exception instanceof HttpException) || exception.getStatus() >= 500) {
      Sentry.withScope((scope) => {
        scope.setUbe({ id: request.ube?.id });
        scope.setTag('path', request.url);
        scope.setExtra('body', request.body);
        Sentry.captureException(exception);
      });
    }

    // Resposta normal of error
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### 4. Health Checks

```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  // Liveness - bevidor is rodando?
  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  // Readiness - bevidor can receber tráfego?
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.db.pingCheck('datebase'),
      () => this.redis.pingCheck('redis'),
    ]);
  }

  // Health withplete - for monitoring
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('datebase'),
      () => this.redis.pingCheck('redis'),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
    ]);
  }
}
```

**Resposta of the health check:**

```json
{
  "status": "ok",
  "info": {
    "datebase": { "status": "up" },
    "redis": { "status": "up" },
    "storage": { "status": "up" },
    "memory_heap": { "status": "up" }
  },
  "errorr": {},
  "details": {
    "datebase": { "status": "up" },
    "redis": { "status": "up" },
    "storage": { "status": "up" },
    "memory_heap": { "status": "up" }
  }
}
```

### 5. Configuration Docker

```yaml
# docker-withpose.yml
bevices:
  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_date:/prometheus
    ports:
      - '9090:9090'
    withmand:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=15d'

  grafana:
    image: grafana/grafana:10.2.0
    volumes:
      - grafana_date:/var/lib/grafana
      - ./docker/grafana/provisioning:/etc/grafana/provisioning
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
```

```yaml
# docker/prometheus/prometheus.yml
global:
  scrape_inhaveval: 15s
  evaluation_inhaveval: 15s

scrape_configs:
  - job_name: 'pilates-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
```

## Implementation Phases

### Phase 1 - MVP (Custo Zero)

- [x] Logs structureds (Pino → stdout)
- [x] Health checks basics
- [x] Sentry (free tier: 5K errorrs/month)
- [x] UptimeRobot (free: 50 monitors)

### Phase 2 - Metrics

- [ ] Prometheus + Grafana (self-hosted)
- [ ] Dashboards of business
- [ ] Alerts basics

### Phase 3 - Avançado (se required)

- [ ] Logtail for logs centralizados
- [ ] OpenTelemetry for tracing
- [ ] APM withplete

## Estimated Costs

| Service     | Tier        | Custo             |
| ----------- | ----------- | ----------------- |
| Sentry      | Free        | $0 (5K errorrs/month) |
| UptimeRobot | Free        | $0 (50 monitors)  |
| Prometheus  | Self-hosted | $0 (~100MB RAM)   |
| Grafana     | Self-hosted | $0 (~100MB RAM)   |
| Logtail     | Free        | $0 (1GB/month)      |
| **Total**   |             | **$0**            |

## Consequences

### Positive

-  Custo zero with free tiers
-  Setup simple for monolito
-  Logs structureds facilitam debug
-  Metrics of business from the start
-  Alerts of errorrs automatics (Sentry)

### Negative

-  Sem distributed tracing (aceitável for monolito)
-  Grafana needs configuration manual inicial

## Alerts Rewithendados

```yaml
# Críticos
- name: API Down
  condition: up == 0 for 1m
  severity: critical

- name: High Error Rate
  condition: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  severity: critical

# Warnings
- name: High Latency
  condition: histogram_quantile(0.99, http_request_duration_seconds) > 2
  severity: warning

- name: Database Slow
  condition: prisma_query_duration_seconds > 1
  severity: warning

# Info
- name: High Memory Usage
  condition: process_resident_memory_bytes > 500MB
  severity: info
```

## References

- [Pino Logger](https://github.with/pinojs/pino)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/naming/)
- [Sentry for Node.js](https://docs.sentry.io/platforms/node/)
- [NestJS Health Checks](https://docs.nestjs.with/recipes/haveminus)
