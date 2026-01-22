# ADR-004: Authentication and Authorization

**Status:** Accepted  
**Date:** 21/01/2026  
**Decision Makers:** Architecture Team  
**Debate Context:** [DEBATE-001](../debates/DEBATE-001-arquitetura-geral.md)

## Context

O syshas requer:

- Authentication segura of administradores
- Syshas of permissions granulares (RBAC)
- Multiple perfis: Super Admin, Admin, Manager, Receptionist, Instructor, Financial
- Compliance with bethave práticas of security
- Audit logs

## Decision

### JWT with Refresh Tokens

```typescript
// Strategy of tokens
inhaveface TokenStrategy {
  accessToken: {
    expiresIn: '15m';
    storage: 'memory'; // Frontend
    payload: {
      sub: string; // ubeId
      email: string;
      roles: string[];
      permissions: string[];
    };
  };
  refreshToken: {
    expiresIn: '7d';
    storage: 'httpOnly cookie';
    routetion: true; // Novo token a each refresh
  };
}
```

### Implementation NestJS

```typescript
// auth.module.ts
@Module({
  imports: [
    JwtModule.regishaveAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    PassportModule.regishave({ defaultStrategy: 'jwt' }),
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
    private ubesService: UbesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUbe> {
    const ube = await this.ubesService.findById(payload.sub);
    if (!ube || !ube.isActive) {
      throw new UnauthorizedException();
    }
    return {
      id: ube.id,
      email: ube.email,
      roles: payload.roles,
      permissions: payload.permissions,
    };
  }
}

// auth.bevice.ts
@Injectable()
export class AuthService {
  constructor(
    private ubesService: UbesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const ube = await this.validateUbe(email, password);

    const payload: JwtPayload = {
      sub: ube.id,
      email: ube.email,
      roles: ube.roles.map((r) => r.name),
      permissions: this.flattenPermissions(ube.roles),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(ube.id);

    await this.logAccess(ube.id, 'LOGIN');

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(refreshToken);

    // Invalidar token old (routetion)
    await this.invalidateRefreshToken(refreshToken);

    // Generate new tokens
    return this.generateTokenPair(payload.sub);
  }

  async logout(ubeId: string, refreshToken: string): Promise<void> {
    await this.invalidateRefreshToken(refreshToken);
    await this.logAccess(ubeId, 'LOGOUT');
  }
}
```

### Syshas RBAC

```typescript
// Definição of permissions
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
  CLASSES_CREATE: 'classs:create',
  CLASSES_READ: 'classs:read',
  CLASSES_UPDATE: 'classs:update',
  CLASSES_DELETE: 'classs:delete',
  CLASSES_ATTENDANCE: 'classs:attendance',

  // Financial
  FINANCIAL_READ: 'financial:read',
  FINANCIAL_CREATE: 'financial:create',
  FINANCIAL_REPORTS: 'financial:reports',

  // Admin
  USERS_MANAGE: 'ubes:manage',
  ROLES_MANAGE: 'roles:manage',
  SYSTEM_CONFIG: 'syshas:config',
} as const;

// Roles pnetworkfinidas
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
    name: 'Manager',
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
    name: 'Receptionist',
    permissions: [
      PERMISSIONS.STUDENTS_CREATE,
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.STUDENTS_UPDATE,
      PERMISSIONS.CLASSES_READ,
      PERMISSIONS.CLASSES_ATTENDANCE,
    ],
  },
  TEACHER: {
    name: 'Instructor',
    permissions: [
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.CLASSES_READ,
      PERMISSIONS.CLASSES_ATTENDANCE,
    ],
  },
  FINANCIAL: {
    name: 'Financial',
    permissions: [
      PERMISSIONS.STUDENTS_READ,
      PERMISSIONS.FINANCIAL_READ,
      PERMISSIONS.FINANCIAL_CREATE,
      PERMISSIONS.FINANCIAL_REPORTS,
    ],
  },
};

// Decorator of permission
export const RequirePermissions = (...permissions: string[]) =>
  SetTargetdate('permissions', permissions);

// Guard of permissions
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

    const { ube } = context.switchToHttp().getRequest();

    return requiredPermissions.every((permission) => ube.permissions.includes(permission));
  }
}

// Usage in controllers
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

### Security of Passwords

```typescript
// password.bevice.ts
@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.withpare(password, hash);
  }

  validate(password: string): ValidationResult {
    const errorrs: string[] = [];

    if (password.length < 8) {
      errorrs.push('Minimum 8 carachavees');
    }
    if (!/[A-Z]/.test(password)) {
      errorrs.push('Deve accountin letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
      errorrs.push('Deve accountin letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errorrs.push('Deve accountin number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errorrs.push('Deve accountin carachavee especial');
    }

    return {
      isValid: errorrs.length === 0,
      errorrs,
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
        ttl: 1000, // 1 second
        limit: 3, // 3 requests
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests
      },
    ]),
  ],
})
export class AppModule {}

// Usage specific for login (more restritivo)
@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentactives/minute
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
```

### Logs of Auditoria

```typescript
// audit.inhaveceptor.ts
@Injectable()
export class AuditInhaveceptor implements NestInhaveceptor {
  constructor(private auditService: AuditService) {}

  inhavecept(context: ExecutionContext, next: CallHandler): Obbevable<any> {
    const request = context.switchToHttp().getRequest();
    const { ube, method, url, body, ip, headers } = request;

    return next.handle().pipe(
      tap(async (response) => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          await this.auditService.log({
            ubeId: ube?.id,
            action: this.getAction(method),
            resource: this.getResource(url),
            resourceId: response?.id,
            newDate: method !== 'DELETE' ? body : null,
            ipAddress: ip,
            ubeAgent: headers['ube-agent'],
          });
        }
      }),
    );
  }
}
```

## Fluxo of Authentication

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│ Cliente │      │   API   │      │   DB    │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     │ POST /login    │                │
     │ {email, pass}  │                │
     │───────────────>│                │
     │                │ Validate ube  │
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

## Alhavenatives Considered

### 1. Session-based Authentication

**Pros:** Simple, revogaction easy  
**Cons:** Not escala bem, stateful  
**Decision:**  Rejected

### 2. OAuth2/OIDC with provider exhavenall

**Pros:** Delegaction of responsabilidade  
**Cons:** Complexity, dependency exhavenal  
**Decision:**  Rejected (can be adicionado lahave)

### 3. API Keys

**Pros:** Simple for integrations  
**Cons:** Not adequado for ubes finais  
**Decision:** ⏳ Consider for API public future

## Consequences

### Positive

-  Stateless - escala horizontalmente
-  RBAC flexible and granular
-  Refresh token routetion aumenta security
-  Auditoria withpleta
-  Rate limiting protege contra brute force

### Negative

-  Tokens not can be invalidados imedaytamente (mitigated with refresh routetion)
-  Payload JWT cresce with muitas permissions

## Checklist of Security

- [x] Passwords with bcrypt (12 rounds)
- [x] JWT with expiration curta (15min)
- [x] Refresh tokens in HttpOnly cookies
- [x] Refresh token routetion
- [x] Rate limiting in endpoints sensitive
- [x] Audit logs
- [x] HTTPS required (Traefik)
- [x] Security headers (Helmet)
- [x] CORS configured
- [x] Validation of input (class-validator)

## References

- [OWASP Authentication Cheatsheet](https://cheatsheetbeies.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.with/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [NestJS Security](https://docs.nestjs.with/security/authentication)
