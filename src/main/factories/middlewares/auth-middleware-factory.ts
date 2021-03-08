import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../usecases/db-load-account-by-token'

export const makeAuthMiddleware = (): AuthMiddleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken())
}
