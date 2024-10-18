module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testEnvironment: 'node'
};
