module.exports = {
  extends: ['next/core-web-vitals', '../../.eslintrc.cjs'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    '**/__tests__/**',
    '**/*.test.tsx',
    '**/*.test.ts',
    '**/*.spec.tsx',
    '**/*.spec.ts',
    '**/error.tsx',
    '**/loading.tsx',
    '**/not-found.tsx',
  ],
  rules: {
    // Disable rules that require type info for Next.js infrastructure files
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
