import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/shared/infrastructure/database/prisma.service';
import { MailService } from '@/shared/infrastructure/mail/mail.service';
import { PasswordService } from '@/modules/auth/infrastructure/services/password.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const prisma = this.prisma as any;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists (security best practice)
    if (!user) {
      return;
    }

    const secret = this.configService.get<string>('JWT_RESET_SECRET');
    if (!secret) {
      throw new Error('JWT_RESET_SECRET is required but not configured');
    }

    const token = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      {
        secret,
        expiresIn: '1h',
      },
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const prisma = this.prisma as any;

    const secret = this.configService.get<string>('JWT_RESET_SECRET');
    if (!secret) {
      throw new Error('JWT_RESET_SECRET is required but not configured');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret,
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await this.passwordService.hash(newPassword);

    await prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash },
    });

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
  }
}


