# US-002-002: Refresh Token

## Information

| Field            | Value          |
| ---------------- | -------------- |
| **ID**           | US-002-002     |
| **Epic**         | EPIC-002       |
| **Title**        | Refresh Token  |
| **Estimate**     | 3 hours        |
| **Priority**     | 🔴 Critical    |
| **Dependencies** | US-002-001     |
| **Status**       | Backlog        |

---

## User Story

**Como** usuário logado  
**I want to** que minha sessão seja renovada automaticamente  
**Para** não precisar fazer login frequentemente

---

## Objectives

1. Implementar endpoint POST /auth/refresh
2. Validar refresh token do cookie
3. Gerar novo access token
4. Implementar rotação de tokens
5. Invalidar refresh token antigo
6. Interceptor automático no frontend

---

## Acceptance Criteria

- [ ] Access token com expiração curta (15min)
- [ ] Refresh token em cookie httpOnly (7 dias)
- [ ] Renovação automática transparente
- [ ] Logout invalida refresh token
- [ ] Rotação de tokens implementada
- [ ] Interceptor no frontend para refresh automático

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS. Preciso implementar refresh token com rotação
e renovação automática.

## Tarefa

### 1. Refresh Token Service

- Gerar refresh token (JWT, 7 dias)
- Armazenar em Redis (ou database)
- Validar refresh token
- Rotacionar tokens (invalidar antigo, criar novo)

### 2. Refresh Endpoint

POST /auth/refresh

- Ler refresh token do cookie
- Validar token
- Gerar novo access token
- Gerar novo refresh token (rotação)
- Invalidar token antigo
- Retornar novo access token
- Atualizar cookie com novo refresh token

### 3. Frontend Interceptor

- Interceptar 401 responses
- Tentar refresh automático
- Retry request original
- Redirect para login se refresh falhar

## Dependencies

- Redis (ou Prisma para armazenar tokens)
- @nestjs/jwt
```

---

## Implementation Details

### Refresh Token Service

```typescript
// src/modules/auth/infrastructure/services/refresh-token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateRefreshToken(userId: string): Promise<string> {
    const token = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    // Store in database
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return token;
  }

  async validateRefreshToken(token: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if token exists in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload.sub; // userId
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async rotateRefreshToken(oldToken: string, userId: string): Promise<string> {
    // Revoke old token
    await this.revokeRefreshToken(oldToken);

    // Generate new token
    return this.generateRefreshToken(userId);
  }
}
```

### Refresh Endpoint

```typescript
// src/modules/auth/infrastructure/controllers/auth.controller.ts
@Post('refresh')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Refresh access token' })
@ApiResponse({ status: 200, type: LoginResponseDto })
@ApiResponse({ status: 401, description: 'Invalid refresh token' })
async refresh(
  @Cookies('refreshToken') refreshToken: string,
  @Res({ passthrough: true }) res: Response,
) {
  if (!refreshToken) {
    throw new UnauthorizedException('Refresh token not provided');
  }

  const result = await this.authService.refresh(refreshToken);

  if (result.isLeft()) {
    throw result.value;
  }

  const { accessToken, refreshToken: newRefreshToken } = result.value;

  // Update refresh token cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken };
}
```

### Prisma Schema Addition

```prisma
// apps/api/prisma/schema.prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  revoked   Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}
```

### Frontend Interceptor

```typescript
// apps/web/lib/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

---

## Checklist of Verification

- [ ] Endpoint POST /auth/refresh funciona
- [ ] Refresh token validado corretamente
- [ ] Rotação de tokens implementada
- [ ] Token antigo invalidado
- [ ] Frontend interceptor funcionando
- [ ] Renovação automática transparente
- [ ] Testes unitários (≥80%)
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## Next User Story

→ [US-002-003: Recovery of Senha](./US-002-003-recovery-senha.md)

