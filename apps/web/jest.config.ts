import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@stores/(.*)$': '<rootDir>/stores/$1',
    '^@types/(.*)$': '<rootDir>/types/$1',
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'stores/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!app/layout.tsx', // Next.js root layout is a server component
    '!app/error.tsx', // Error boundaries are infrastructure
    '!app/loading.tsx', // Loading states are infrastructure
    '!app/not-found.tsx', // Not found pages are infrastructure
    '!app/**/error.tsx', // Route-specific error boundaries
    '!app/**/loading.tsx', // Route-specific loading states
    '!lib/env.ts', // Environment validation is infrastructure
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transformIgnorePatterns: ['node_modules/(?!(msw|@mswjs)/)'],
};

export default createJestConfig(config);
