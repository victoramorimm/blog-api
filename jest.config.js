module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/data/protocols/criptography/hasher.ts',
    '!<rootDir>/src/data/usecases/account/add-account/db-add-account-protocols.ts',
    '!<rootDir>/src/data/usecases/account/load-account-by-token/db-load-account-by-token-protocols.ts',
    '!<rootDir>/src/data/usecases/account/authentication/db-authentication-protocols.ts',
    '!<rootDir>/src/presentation/controllers/signup/signup-protocols.ts',
    '!<rootDir>/src/presentation/controllers/publication/load-publications/load-publications-controller-protocols.ts',
    '!<rootDir>/src/presentation/middlewares/auth-middleware-protocols.ts',
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
