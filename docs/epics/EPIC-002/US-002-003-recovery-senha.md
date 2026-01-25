# US-002-003: Recovery of Senha

## Information

| Field            | Value                |
| ---------------- | -------------------- |
| **ID**           | US-002-003           |
| **Epic**         | EPIC-002             |
| **Title**        | Recovery of Senha    |
| **Estimate**     | 4 hours              |
| **Priority**     | 🟡 Medium            |
| **Dependencies** | US-002-001           |
| **Status**       | Backlog              |

---

## User Story

**Como** usuário  
**I want to** recuperar minha senha via email  
**Para** acessar o sistema caso esqueça

---

## Objectives

1. Criar endpoint POST /auth/forgot-password
2. Criar endpoint POST /auth/reset-password
3. Gerar token de reset temporário (1h)
4. Enviar email com link de reset
5. Validar força da senha
6. Invalidar token após uso

---

## Acceptance Criteria

- [ ] Solicitar reset via email
- [ ] Email com link único e temporário
- [ ] Form para nova senha
- [ ] Validação de força de senha
- [ ] Token expira em 1h
- [ ] Token invalidado após uso
- [ ] Integração com MailHog (dev) / SMTP (prod)

---

## Prompt for Implementation

```markdown
## Context

Backend NestJS. Preciso implementar recuperação de senha
com token temporário e envio de email.

## Tarefa

### 1. Password Reset Service

- Gerar token de reset (JWT, 1h)
- Armazenar token no database
- Validar token
- Invalidar após uso

### 2. Email Service

- Enviar email com link de reset
- Link: /reset-password?token=xxx
- Template de email HTML
- Integração MailHog (dev) / SMTP (prod)

### 3. Endpoints

POST /auth/forgot-password
- Recebe email
- Gera token
- Envia email

POST /auth/reset-password
- Recebe token e nova senha
- Valida token
- Atualiza senha
- Invalida token

### 4. Validação de Senha

- 8+ caracteres
- Maiúscula
- Minúscula
- Número
- Caractere especial

## Dependencies

- @nestjs-modules/mailer
- nodemailer
- class-validator (validação de senha)
```

---

## Implementation Details

### Password Reset Service

```typescript
// src/modules/auth/infrastructure/services/password-reset.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { MailService } from '@/shared/infrastructure/mail/mail.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return;
    }

    // Generate reset token
    const token = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
        expiresIn: '1h',
      },
    );

    // Store token
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Validate token
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Check if token exists and is valid
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash new password
    const passwordHash = await this.passwordService.hash(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }
}
```

### Prisma Schema Addition

```prisma
// apps/api/prisma/schema.prisma
model PasswordResetToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}
```

### Auth Controller Endpoints

```typescript
// src/modules/auth/infrastructure/controllers/auth.controller.ts
@Post('forgot-password')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Request password reset' })
@ApiResponse({ status: 200, description: 'If email exists, reset link sent' })
async forgotPassword(@Body() dto: ForgotPasswordDto) {
  await this.authService.requestPasswordReset(dto.email);
  // Always return success (don't reveal if email exists)
  return { message: 'If the email exists, a reset link has been sent' };
}

@Post('reset-password')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Reset password with token' })
@ApiResponse({ status: 200, description: 'Password reset successfully' })
async resetPassword(@Body() dto: ResetPasswordDto) {
  await this.authService.resetPassword(dto.token, dto.password);
  return { message: 'Password reset successfully' };
}
```

### DTOs

```typescript
// src/modules/auth/application/dto/forgot-password.dto.ts
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

// src/modules/auth/application/dto/reset-password.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;
}
```

### Mail Service

```typescript
// src/shared/infrastructure/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'password-reset',
      context: {
        resetUrl,
        expiresIn: '1 hour',
      },
    });
  }
}
```

### Email Template

```html
<!-- apps/api/src/shared/infrastructure/mail/templates/password-reset.hbs -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
</head>
<body>
  <h1>Reset Your Password</h1>
  <p>Click the link below to reset your password:</p>
  <a href="{{resetUrl}}">Reset Password</a>
  <p>This link expires in {{expiresIn}}.</p>
  <p>If you didn't request this, please ignore this email.</p>
</body>
</html>
```

### Frontend Reset Password Page

```typescript
// apps/web/app/(auth)/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Senha deve conter maiúscula, minúscula, número e caractere especial',
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
  }, [token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao resetar senha');
      }

      router.push('/login?reset=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resetar senha');
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

- [ ] Endpoint POST /auth/forgot-password funciona
- [ ] Endpoint POST /auth/reset-password funciona
- [ ] Token gerado e armazenado
- [ ] Email enviado (MailHog em dev)
- [ ] Token expira em 1h
- [ ] Token invalidado após uso
- [ ] Validação de força de senha
- [ ] Frontend integrado
- [ ] Testes unitários (≥80%)
- [ ] Testes de integração
- [ ] Documentação Swagger

---

## Next User Story

→ [US-002-004: Controle of Acesso por Profile](./US-002-004-controle-acesso-perfil.md)

