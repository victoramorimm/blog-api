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
import {
  badRequest,
  noContent,
  serverError,
  unauthorized
} from '../../helpers/http'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errorWithMissingFields = makeRequiredFieldsValidationForLogin(
        httpRequest
      )

      if (!errorWithMissingFields) {
        const { email, password } = httpRequest.body

        const isEmailValid = this.emailValidator.validate(email)

        if (!isEmailValid) {
          return badRequest(new InvalidParamError('email'))
        }

        const isAuthenticationValid = await this.authentication.authenticate({
          email,
          password
        })

        if (isAuthenticationValid === null) {
          return unauthorized(new AuthenticationError())
        }

        return noContent()
      }

      return errorWithMissingFields
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
