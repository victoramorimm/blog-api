import { AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError } from '../../presentation/errors'
import { badRequest } from '../../presentation/helpers/http'
import { EmailValidator } from '../../presentation/protocols/email-validator'

export class DbAddAccount implements AddAccount {
  constructor(private readonly emailValidator: EmailValidator) {}

  async add(value: any): Promise<any> {
    const { email } = value.body

    const isEmailValid = this.emailValidator.validate(email)

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
