import { DbAddAccount } from '../../../data/usecases/account/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account/account-mongo-repository'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12

  return new DbAddAccount(
    new BcryptAdapter(salt),
    new AccountMongoRepository(),
    new AccountMongoRepository()
  )
}
