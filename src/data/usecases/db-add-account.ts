import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db'
import { Hasher } from '../../domain/protocols/hasher'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { EmailValidator } from '../../presentation/protocols/email-validator'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly hasher: Hasher
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const { email, password } = accountData

    this.emailValidator.validate(email)

    await this.hasher.hash(password)

    return null
  }
}
