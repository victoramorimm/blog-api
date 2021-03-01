import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  Authentication,
  makeRequiredFieldsValidationForLogin
} from './login-controller-protocols'
import {
  AuthenticationError,
  InvalidParamError,
  ServerError
} from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingFieldError = makeRequiredFieldsValidationForLogin(
        httpRequest
      )

      if (missingFieldError) {
        return missingFieldError
      }

      const { email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.validate(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.authenticate({
        email,
        password
      })

      if (accessToken === null) {
        return unauthorized(new AuthenticationError())
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
