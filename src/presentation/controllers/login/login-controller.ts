import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../../protocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return await new Promise((resolve) =>
          resolve(badRequest(new MissingParamError(field)))
        )
      }
    }

    const isEmailValid = this.emailValidator.validate(httpRequest.body.email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
