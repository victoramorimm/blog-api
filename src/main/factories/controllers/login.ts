import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { makeDbAuthentication } from '../usecases/db-authentication'
import { makeEmailValidatorAdapter } from '../validators/email-validator-adapter-factory'

export const makeLoginController = (): Controller => {
  return new LoginController(
    makeEmailValidatorAdapter(),
    makeDbAuthentication()
  )
}
