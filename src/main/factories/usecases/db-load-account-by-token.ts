import { DbLoadAccountByToken } from '../../../data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account/account-mongo-repository'
import env from '../../config/env'

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  return new DbLoadAccountByToken(
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
}
