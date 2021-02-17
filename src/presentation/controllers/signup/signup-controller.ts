import { Hasher } from '../../../domain/protocols/hasher'
import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { MissingParamError } from '../../errors/missing-param-error'
import { ServerError } from '../../errors/server-error'
import { badRequest, ok, serverError } from '../../helpers/http'
import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly hasher: Hasher,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, name, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isEmailValid = this.emailValidator.validate(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.hasher.hash(password)

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
