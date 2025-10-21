export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  silent: false,
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup/silencioConsole.js'],
};