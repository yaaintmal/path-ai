module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  extensionsToTreatAsEsm: [],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).ts?(x)',
    '<rootDir>/src/**/*.(spec|test).ts?(x)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
