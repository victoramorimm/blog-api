import {
  AddAccount,
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  makeRequiredFieldsValidationForSignUp
} from './signup-protocols'
import {
  EmailAlreadyInUseError,
  InvalidParamError,
  ServerError
} from '../../errors'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingFields = makeRequiredFieldsValidationForSignUp(httpRequest)

      if (!missingFields) {
        const { email, name, password, passwordConfirmation } = httpRequest.body

        if (password !== passwordConfirmation) {
          return badRequest(new InvalidParamError('passwordConfirmation'))
        }

        const isEmailValid = this.emailValidator.validate(email)

        if (!isEmailValid) {
          return badRequest(new InvalidParamError('email'))
        }

        const account = await this.addAccount.add({
          name,
          email,
          password
        })

        if (!account) {
          return forbidden(new EmailAlreadyInUseError())
        }

        return ok(account)
      }

      return missingFields
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
