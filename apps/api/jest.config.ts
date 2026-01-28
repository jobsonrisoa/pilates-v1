import type { Config } from 'jest';

// Ensure JWT secrets are always set during tests, without affecting production
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_32_chars_minimum_123456';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_32_chars_minimum_ABCDEF';

const config: Config = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/(src|test)/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/**/index.ts',
    '!src/main.ts',
    '!src/config/**', // Environment validation is infrastructure
    '!src/shared/filters/**', // Exception filters are infrastructure (tested via integration)
    '!src/shared/interceptors/**', // Interceptors are infrastructure (tested via integration)
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  maxWorkers: process.env.CI ? '50%' : '100%', // Use all CPUs in development
  verbose: false, // Disable verbose output for faster execution
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  coverageProvider: 'v8',
  cache: true, // Enable Jest cache for faster subsequent runs
  // Use a temporary directory for Jest cache to avoid permission issues in read-only environments
  cacheDirectory: process.env.JEST_CACHE_DIR || '/tmp/pilates-api-jest-cache',
};

export default config;
