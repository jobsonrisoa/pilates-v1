# ADR-005: Observabilidade

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O sistema precisa de observabilidade para:

- Detectar e diagnosticar problemas rapidamente
- Monitorar performance
- Auditoria de operações
- Alertas de incidentes
- Custo baixo (serviços gratuitos preferencialmente)

## Decisão

### Stack de Observabilidade

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
│  │     ↓       │  │             │  │   Alertas           │  │
│  │  Logtail*   │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────────────────────────────┐   │
│  │   UPTIME    │  │           HEALTH CHECKS             │   │
│  │ UptimeRobot │  │  /health, /health/live, /health/ready│  │
│  └─────────────┘  └─────────────────────────────────────┘   │
│                                                             │
│  * Logtail opcional - free tier 1GB/mês                     │
└─────────────────────────────────────────────────────────────┘
```

### 1. Logging com Pino

```typescript
// logger.module.ts
import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,

        // Campos customizados
        customProps: () => ({
          service: 'pilates-api',
          environment: process.env.NODE_ENV,
        }),

        // Redact de dados sensíveis
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
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            userId: req.user?.id,
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

// Uso em services
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
    } catch (error) {
      this.logger.error({ error, dto: { name: dto.name } }, 'Failed to create student');
      throw error;
    }
  }
}
```

**Formato de log em produção (JSON):**

```json
{
  "level": 30,
  "time": 1705851234567,
  "pid": 1,
  "hostname": "api-1",
  "service": "pilates-api",
  "environment": "production",
  "req": {
    "id": "abc-123",
    "method": "POST",
    "url": "/students",
    "userId": "user-456"
  },
  "msg": "Student created",
  "studentId": "student-789"
}
```

### 2. Métricas com Prometheus

```typescript
// metrics.module.ts
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
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
  providers: [
    // Contador de requisições HTTP
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    }),

    // Histograma de duração
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    }),

    // Métricas de negócio
    makeCounterProvider({
      name: 'students_created_total',
      help: 'Total students created',
    }),
    makeCounterProvider({
      name: 'payments_processed_total',
      help: 'Total payments processed',
      labelNames: ['status', 'method'],
    }),
    makeCounterProvider({
      name: 'classes_scheduled_total',
      help: 'Total classes scheduled',
      labelNames: ['modality'],
    }),
  ],
  exports: [PrometheusModule],
})
export class MetricsModule {}

// metrics.interceptor.ts
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, route } = request;
    const path = route?.path || request.url;

    const end = this.requestDuration.startTimer({ method, path });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.requestsCounter.inc({ method, path, status: response.statusCode });
        end();
      }),
      catchError((error) => {
        const status = error.status || 500;
        this.requestsCounter.inc({ method, path, status });
        end();
        throw error;
      }),
    );
  }
}
```

**Dashboards Grafana sugeridos:**

- Overview: requests/s, latência p99, erros
- Negócio: novos alunos, aulas agendadas, pagamentos
- Infraestrutura: CPU, memória, conexões DB

### 3. Erro Tracking com Sentry

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
        tracesSampleRate: 0.1, // 10% para performance

        // Filtrar dados sensíveis
        beforeSend(event) {
          if (event.request?.data) {
            delete event.request.data.password;
            delete event.request.data.cpf;
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

// sentry.filter.ts
@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Não enviar erros esperados (4xx)
    if (!(exception instanceof HttpException) || exception.getStatus() >= 500) {
      Sentry.withScope((scope) => {
        scope.setUser({ id: request.user?.id });
        scope.setTag('path', request.url);
        scope.setExtra('body', request.body);
        Sentry.captureException(exception);
      });
    }

    // Resposta normal de erro
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

  // Liveness - servidor está rodando?
  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  // Readiness - servidor pode receber tráfego?
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
    ]);
  }

  // Health completo - para monitoring
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
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

**Resposta do health check:**

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "storage": { "status": "up" },
    "memory_heap": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "storage": { "status": "up" },
    "memory_heap": { "status": "up" }
  }
}
```

### 5. Configuração Docker

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus:v2.48.0
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - '9090:9090'
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=15d'

  grafana:
    image: grafana/grafana:10.2.0
    volumes:
      - grafana_data:/var/lib/grafana
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
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'pilates-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'
```

## Fases de Implementação

### Fase 1 - MVP (Custo Zero)

- [x] Logs estruturados (Pino → stdout)
- [x] Health checks básicos
- [x] Sentry (free tier: 5K erros/mês)
- [x] UptimeRobot (free: 50 monitors)

### Fase 2 - Métricas

- [ ] Prometheus + Grafana (self-hosted)
- [ ] Dashboards de negócio
- [ ] Alertas básicos

### Fase 3 - Avançado (se necessário)

- [ ] Logtail para logs centralizados
- [ ] OpenTelemetry para tracing
- [ ] APM completo

## Custos Estimados

| Serviço     | Tier        | Custo             |
| ----------- | ----------- | ----------------- |
| Sentry      | Free        | $0 (5K erros/mês) |
| UptimeRobot | Free        | $0 (50 monitors)  |
| Prometheus  | Self-hosted | $0 (~100MB RAM)   |
| Grafana     | Self-hosted | $0 (~100MB RAM)   |
| Logtail     | Free        | $0 (1GB/mês)      |
| **Total**   |             | **$0**            |

## Consequências

### Positivas

- ✅ Custo zero com free tiers
- ✅ Setup simples para monolito
- ✅ Logs estruturados facilitam debug
- ✅ Métricas de negócio desde o início
- ✅ Alertas de erros automáticos (Sentry)

### Negativas

- ⚠️ Sem distributed tracing (aceitável para monolito)
- ⚠️ Grafana precisa configuração manual inicial

## Alertas Recomendados

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

## Referências

- [Pino Logger](https://github.com/pinojs/pino)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/naming/)
- [Sentry for Node.js](https://docs.sentry.io/platforms/node/)
- [NestJS Health Checks](https://docs.nestjs.com/recipes/terminus)
