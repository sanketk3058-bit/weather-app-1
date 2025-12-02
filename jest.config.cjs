/**
 * Jest configuration for the project (TypeScript + React + jsdom)
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}

// Use a Jest-specific tsconfig to ensure JSX is emitted for tests
module.exports.globals = {
  'ts-jest': {
    tsconfig: '<rootDir>/tsconfig.jest.json'
  }
}
