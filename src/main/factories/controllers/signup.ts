import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { makeDbAddAccount } from '../usecases/db-add-account-factory'
import { makeEmailValidatorAdapter } from '../validators/email-validator-adapter-factory'

export const makeSignUpController = (): SignUpController => {
  return new SignUpController(makeDbAddAccount(), makeEmailValidatorAdapter())
}
