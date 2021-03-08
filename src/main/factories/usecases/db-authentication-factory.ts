import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account/account-mongo-repository'
import env from '../../config/env'

export const makeDbAuthentication = (): DbAuthentication => {
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(12),
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
}
