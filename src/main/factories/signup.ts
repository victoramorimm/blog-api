import { DbAddAccount } from '../../data/usecases/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account/account-mongo-repository'
import { SignUpController } from '../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()

  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)

  const accountMongoRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )

  return new SignUpController(dbAddAccount, emailValidatorAdapter)
}
