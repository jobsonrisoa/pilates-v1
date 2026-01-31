import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './application/services/auth.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { JwtService } from './infrastructure/services/jwt.service';
import { PasswordResetService } from './infrastructure/services/password-reset.service';
import { PasswordService } from './infrastructure/services/password.service';
import { RefreshTokenService } from './infrastructure/services/refresh-token.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

import { PrismaModule } from '@/shared/infrastructure/database/prisma.module';
import { MailModule } from '@/shared/infrastructure/mail/mail.module';


@Module({
  imports: [
    PrismaModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is required but not configured');
        }
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUseCase,
    RefreshTokenUseCase,
    PasswordService,
    JwtService,
    RefreshTokenService,
    PasswordResetService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
