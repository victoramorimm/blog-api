import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '../usecases/db-authentication-factory'
import { makeEmailValidatorAdapter } from '../validators/email-validator-adapter-factory'

export const makeLoginController = (): LoginController => {
  return new LoginController(
    makeEmailValidatorAdapter(),
    makeDbAuthentication()
  )
}
