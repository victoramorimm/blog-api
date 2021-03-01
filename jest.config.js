module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/data/protocols/criptography/hasher.ts',
    '!<rootDir>/src/data/usecases/add-account/db-add-account-protocols.ts',
    '!<rootDir>/src/data/usecases/authentication/db-authentication-protocols.ts',
    '!<rootDir>/src/presentation/controllers/signup/signup-protocols.ts',
    '!<rootDir>/src/presentation/protocols/index.ts',
    '!<rootDir>/src/presentation/helpers/http.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
