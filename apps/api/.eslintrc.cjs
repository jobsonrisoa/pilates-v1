module.exports = {
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['prisma/**', 'test/**', 'dist/**', '*.spec.ts', '*.test.ts'],
};
