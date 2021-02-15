import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new MissingParamError(field)
        }
      }
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return {
        statusCode: 400,
        body: new InvalidParamError('passwordConfirmation')
      }
    }

    this.emailValidator.validate(httpRequest.body.email)

    return null
  }
}
