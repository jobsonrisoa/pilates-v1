// Minimal type declarations for @nestjs-modules/mailer to satisfy TypeScript

declare module '@nestjs-modules/mailer' {
  import type { DynamicModule } from '@nestjs/common';

  export interface MailerOptions {
    transport?: unknown;
    defaults?: {
      from?: string;
      [key: string]: unknown;
    };
    template?: unknown;
  }

  export class MailerService {
    sendMail(options: unknown): Promise<void>;
  }

  export class MailerModule {
    static forRootAsync(options: {
      useFactory: (...args: any[]) => MailerOptions | Promise<MailerOptions>;
      inject?: any[];
      imports?: any[];
    }): DynamicModule;
  }
}


