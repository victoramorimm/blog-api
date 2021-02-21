module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/data/protocols/criptography/hasher.ts',
    '!<rootDir>/src/data/usecases/db-add-account-protocols.ts',
    '!<rootDir>/src/presentation/controllers/signup/signup-protocols.ts',
    '!<rootDir>/src/presentation/protocols/index.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
