# US-002-001: Login of User

## Information

| Field            | Value          |
| ---------------- | -------------- |
| **ID**           | US-002-001     |
| **Epic**         | EPIC-002       |
| **Title**        | Login of User  |
| **Estimate**     | 4 hours        |
| **Priority**     | 🔴 Critical    |
| **Dependencies** | US-001-002     |
| **Status**       | Backlog        |

---

## User Story

**Como** usuário do sistema  
**I want to** fazer login com email e senha  
**Para** acessar as funcionalidades do sistema

---

## Objectives

1. Criar endpoint POST /auth/login
2. Validar credenciais (email e senha)
3. Gerar JWT access token (15min)
4. Gerar refresh token (7 dias)
5. Retornar tokens e informações do usuário
6. Implementar rate limiting (5 tentativas/min)

---

## Acceptance Criteria

- [ ] Form de login funcional
- [ ] Validação de campos (email, senha)
- [ ] Mensagens de erro claras
- [ ] Redirecionamento após login
- [ ] Token armazenado de forma segura
- [ ] Rate limiting implementado (5/min)
- [ ] Integração com frontend funcionando

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS com DDD. Preciso implementar autenticação
com JWT e refresh tokens.

## Tarefa

### 1. Auth Module (DDD Structure)

Criar estrutura:

```
src/modules/auth/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   └── password.vo.ts
│   └── repositories/
│       └── user.repository.ts
├── application/
│   ├── use-cases/
│   │   └── login.use-case.ts
│   └── dto/
│       ├── login.dto.ts
│       └── login-response.dto.ts
├── infrastructure/
│   ├── repositories/
│   │   └── prisma-user.repository.ts
│   └── services/
│       ├── jwt.service.ts
│       └── password.service.ts
└── auth.module.ts
```

### 2. Login Endpoint

POST /auth/login

Request:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["ADMIN"]
  }
}
```

Refresh token em cookie httpOnly.

### 3. Validações

- Email válido
- Senha: 8+ caracteres, maiúscula, minúscula, número, especial
- Usuário ativo
- Credenciais corretas

### 4. Security

- bcrypt (12 rounds)
- Rate limiting (ThrottlerModule)
- JWT secret forte
- Refresh token em cookie httpOnly, secure, sameSite

## Dependencies

- @nestjs/jwt
- @nestjs/passport
- passport-jwt
- @nestjs/throttler
- bcrypt
```

---

## Implementation Details

### Auth Module Structure

```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 5, // 5 requests
    }]),
  ],
  providers: [AuthService, PasswordService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### Login Use Case

```typescript
// src/modules/auth/application/use-cases/login.use-case.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Either, left, right } from '@/shared/domain/either';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { PasswordService } from '@/modules/auth/infrastructure/services/password.service';
import { JwtService } from '@/modules/auth/infrastructure/services/jwt.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<Either<Error, { accessToken: string; user: any }>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.isActive) {
      return left(new UnauthorizedException('Invalid credentials'));
    }

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return left(new UnauthorizedException('Invalid credentials'));
    }

    const accessToken = await this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role.name),
    });

    return right({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map((r) => r.role.name),
      },
    });
  }
}
```

### Auth Controller

```typescript
// src/modules/auth/infrastructure/controllers/auth.controller.ts
import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '@/modules/auth/application/dto/login.dto';
import { LoginResponseDto } from '@/modules/auth/application/dto/login-response.dto';
import { AuthService } from '@/modules/auth/application/services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle(5, 60) // 5 requests per minute
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto.email, loginDto.password);

    if (result.isLeft()) {
      throw result.value;
    }

    const { accessToken, refreshToken, user } = result.value;

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken,
      user,
    };
  }
}
```

---

## Frontend Integration

### Login Page

```typescript
// apps/web/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const { accessToken, user } = await response.json();

      // Store access token
      localStorage.setItem('accessToken', accessToken);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Checklist of Verification

- [ ] Endpoint POST /auth/login funciona
- [ ] Validação de email e senha
- [ ] Mensagens de erro claras
- [ ] JWT gerado corretamente
- [ ] Refresh token em cookie httpOnly
- [ ] Rate limiting funcionando (5/min)
- [ ] Frontend integrado
- [ ] Testes unitários (≥80%)
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## Next User Story

→ [US-002-002: Refresh Token](./US-002-002-refresh-token.md)

