import {
  AddAccount,
  HttpRequest,
  HttpResponse,
  Controller
} from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http'

export class SignUpController implements Controller {
  constructor(private readonly addAccount: AddAccount) {}

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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return badRequest(new Error())
      }

      return ok(account)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
