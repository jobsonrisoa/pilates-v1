# ADR-004: Autenticação e Autorização

**Status:** Aceito  
**Data:** 21/01/2026  
**Decisores:** Equipe de Arquitetura  
**Contexto do Debate:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Contexto

O sistema requer:

- Autenticação segura de administradores
- Sistema de permissões granulares (RBAC)
- Múltiplos perfis: Super Admin, Admin, Gerente, Recepcionista, Professor, Financeiro
- Conformidade com melhores práticas de segurança
- Logs de auditoria

## Decisão

### JWT com Refresh Tokens

```typescript
// Estratégia de tokens
interface TokenStrategy {
  accessToken: {
    expiresIn: '15m';
    storage: 'memory'; // Frontend
    payload: {
      sub: string; // userId
      email: string;
      roles: string[];
      permissions: string[];
    };
  };
  refreshToken: {
    expiresIn: '7d';
    storage: 'httpOnly cookie';
    rotation: true; // Novo token a cada refresh
  };
}
```

### Implementação NestJS

```typescript
// auth.module.ts
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.validateUser(email, password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      permissions: this.flattenPermissions(user.roles),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.logAccess(user.id, 'LOGIN');

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken);

    // Invalidar token antigo (rotation)
    await this.invalidateRefreshToken(refreshToken);

    // Gerar novos tokens
    return this.generateTokenPair(payload.sub);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.invalidateRefreshToken(refreshToken);
    await this.logAccess(userId, 'LOGOUT');
  }
}
```

### Sistema RBAC

```typescript
// Definição de permissões
export const PERMISSIONS = {
  // Students
  STUDENTS_CREATE: 'students:create',
  STUDENTS_READ: 'students:read',
  STUDENTS_UPDATE: 'students:update',
  STUDENTS_DELETE: 'students:delete',

  // Teachers
  TEACHERS_CREATE: 'teachers:create',
  TEACHERS_READ: 'teachers:read',
  TEACHERS_UPDATE: 'teachers:update',
  TEACHERS_DELETE: 'teachers:delete',

  // Classes
  CLASSES_CREATE: 'classes:create',
  CLASSES_READ: 'classes:read',
  CLASSES_UPDATE: 'classes:update',
  CLASSES_DELETE: 'classes:delete',
  CLASSES_ATTENDANCE: 'classes:attendance',

  // Financial
  FINANCIAL_READ: 'financial:read',
  FINANCIAL_CREATE: 'financial:create',
  FINANCIAL_REPORTS: 'financial:reports',

  // Admin
  USERS_MANAGE: 'users:manage',
  ROLES_MANAGE: 'roles:manage',
  SYSTEM_CONFIG: 'system:config',
} as const;

// Roles predefinidas
export const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: Object.values(PERMISSIONS),
  },
  ADMIN: {
    name: 'Admin',
    permissions: [
      PERMISSIONS.STUDENTS_CREATE,
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.STUDENTS_UPDATE,
      PERMISSIONS.TEACHERS_CREATE,
      PERMISSIONS.TEACHERS_READ,
      PERMISSIONS.TEACHERS_UPDATE,
      PERMISSIONS.CLASSES_CREATE,
      PERMISSIONS.CLASSES_READ,
      PERMISSIONS.CLASSES_UPDATE,
      PERMISSIONS.CLASSES_ATTENDANCE,
      PERMISSIONS.FINANCIAL_READ,
      PERMISSIONS.FINANCIAL_CREATE,
      PERMISSIONS.FINANCIAL_REPORTS,
      PERMISSIONS.USERS_MANAGE,
    ],
  },
  MANAGER: {
    name: 'Gerente',
    permissions: [
      PERMISSIONS.STUDENTS_CREATE,
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.STUDENTS_UPDATE,
      PERMISSIONS.TEACHERS_READ,
      PERMISSIONS.CLASSES_CREATE,
      PERMISSIONS.CLASSES_READ,
      PERMISSIONS.CLASSES_UPDATE,
      PERMISSIONS.CLASSES_ATTENDANCE,
      PERMISSIONS.FINANCIAL_READ,
      PERMISSIONS.FINANCIAL_REPORTS,
    ],
  },
  RECEPTIONIST: {
    name: 'Recepcionista',
    permissions: [
      PERMISSIONS.STUDENTS_CREATE,
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.STUDENTS_UPDATE,
      PERMISSIONS.CLASSES_READ,
      PERMISSIONS.CLASSES_ATTENDANCE,
    ],
  },
  TEACHER: {
    name: 'Professor',
    permissions: [
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.CLASSES_READ,
      PERMISSIONS.CLASSES_ATTENDANCE,
    ],
  },
  FINANCIAL: {
    name: 'Financeiro',
    permissions: [
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.FINANCIAL_READ,
      PERMISSIONS.FINANCIAL_CREATE,
      PERMISSIONS.FINANCIAL_REPORTS,
    ],
  },
};

// Decorator de permissão
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

// Guard de permissões
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredPermissions.every((permission) => user.permissions.includes(permission));
  }
}

// Uso em controllers
@Controller('students')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StudentsController {
  @Post()
  @RequirePermissions(PERMISSIONS.STUDENTS_CREATE)
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @RequirePermissions(PERMISSIONS.STUDENTS_READ)
  findAll(@Query() query: FindStudentsQuery) {
    return this.studentsService.findAll(query);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.STUDENTS_UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.STUDENTS_DELETE)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
```

### Segurança de Senhas

```typescript
// password.service.ts
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validate(password: string): ValidationResult {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Deve conter letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Deve conter letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Deve conter número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Deve conter caractere especial');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

### Rate Limiting

```typescript
// throttler.config.ts
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 3, // 3 requests
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 20, // 20 requests
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests
      },
    ]),
  ],
})
export class AppModule {}

// Uso específico para login (mais restritivo)
@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentativas/minuto
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
```

### Logs de Auditoria

```typescript
// audit.interceptor.ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url, body, ip, headers } = request;

    return next.handle().pipe(
      tap(async (response) => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          await this.auditService.log({
            userId: user?.id,
            action: this.getAction(method),
            resource: this.getResource(url),
            resourceId: response?.id,
            newData: method !== 'DELETE' ? body : null,
            ipAddress: ip,
            userAgent: headers['user-agent'],
          });
        }
      }),
    );
  }
}
```

## Fluxo de Autenticação

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Cliente │      │   API   │      │   DB    │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     │ POST /login    │                │
     │ {email, pass}  │                │
     │───────────────>│                │
     │                │ Validate user  │
     │                │───────────────>│
     │                │<───────────────│
     │                │                │
     │                │ Generate tokens│
     │                │                │
     │ 200 OK         │                │
     │ {accessToken}  │                │
     │ Set-Cookie:    │                │
     │ refreshToken   │                │
     │<───────────────│                │
     │                │                │
     │ GET /protected │                │
     │ Auth: Bearer   │                │
     │───────────────>│                │
     │                │ Verify JWT     │
     │                │ Check perms    │
     │ 200 OK         │                │
     │<───────────────│                │
     │                │                │
     │ POST /refresh  │                │
     │ Cookie: refresh│                │
     │───────────────>│                │
     │                │ Rotate tokens  │
     │ 200 OK         │                │
     │ New tokens     │                │
     │<───────────────│                │
```

## Alternativas Consideradas

### 1. Session-based Authentication

**Prós:** Simples, revogação fácil  
**Contras:** Não escala bem, stateful  
**Decisão:** ❌ Rejeitado

### 2. OAuth2/OIDC com provider externo

**Prós:** Delegação de responsabilidade  
**Contras:** Complexidade, dependência externa  
**Decisão:** ❌ Rejeitado (pode ser adicionado depois)

### 3. API Keys

**Prós:** Simples para integrações  
**Contras:** Não adequado para usuários finais  
**Decisão:** ⏳ Considerar para API pública futura

## Consequências

### Positivas

- ✅ Stateless - escala horizontalmente
- ✅ RBAC flexível e granular
- ✅ Refresh token rotation aumenta segurança
- ✅ Auditoria completa
- ✅ Rate limiting protege contra brute force

### Negativas

- ⚠️ Tokens não podem ser invalidados imediatamente (mitigado com refresh rotation)
- ⚠️ Payload JWT cresce com muitas permissões

## Checklist de Segurança

- [x] Senhas com bcrypt (12 rounds)
- [x] JWT com expiração curta (15min)
- [x] Refresh tokens em HttpOnly cookies
- [x] Refresh token rotation
- [x] Rate limiting em endpoints sensíveis
- [x] Logs de auditoria
- [x] HTTPS obrigatório (Traefik)
- [x] Headers de segurança (Helmet)
- [x] CORS configurado
- [x] Validação de input (class-validator)

## Referências

- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
