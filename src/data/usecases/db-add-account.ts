import { AddAccount } from '../../domain/usecases/add-account'
import { EmailValidator } from '../../presentation/protocols/email-validator'

export class DbAddAccount implements AddAccount {
  constructor(private readonly emailValidator: EmailValidator) {}

  async add(value: any): Promise<any> {
    const { email } = value.body

    this.emailValidator.validate(email)
  }
}
