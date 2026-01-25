import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
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
  setupFilesAfterEnv: ['<rootDir>/test/integration/setup.ts'],
  globalSetup: '<rootDir>/test/integration/global-setup.ts',
  globalTeardown: '<rootDir>/test/integration/global-teardown.ts',
  maxWorkers: 1,
  testTimeout: 30000,
  verbose: true,
};

export default config;
