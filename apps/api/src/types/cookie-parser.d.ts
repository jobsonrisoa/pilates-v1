// Minimal type declarations for cookie-parser to satisfy TypeScript in environments
// where the package types may not yet be installed.

declare module 'cookie-parser' {
  import type { RequestHandler } from 'express';

  interface CookieParseOptions {
    decode?(val: string): string;
  }

  interface CookieSecretRequestHandler extends RequestHandler {
    secret: string | string[];
  }

  function cookieParser(
    secret?: string | string[],
    options?: CookieParseOptions,
  ): CookieSecretRequestHandler;

  export = cookieParser;
}


