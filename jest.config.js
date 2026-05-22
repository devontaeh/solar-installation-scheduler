/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/*.test.ts'],
  passWithNoTests: true,
  collectCoverageFrom: ['src/services/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
