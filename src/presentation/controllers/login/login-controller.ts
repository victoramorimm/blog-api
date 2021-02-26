import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../../protocols'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email, password } = httpRequest.body

    const isEmailValid = this.emailValidator.validate(email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }

    await this.authentication.authenticate({
      email,
      password
    })
  }
}
