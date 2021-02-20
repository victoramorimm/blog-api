import { AccountReturnedByDbModel } from '../../domain/models/account-returned-by-db'
import { Hasher } from '../../domain/protocols/hasher'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { AddAccountRepository } from '../protocols/add-account-repository'
import { LoadAccountByEmailRepository } from '../protocols/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly hasher: Hasher,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const { name, email, password } = accountData

    this.emailValidator.validate(email)

    await this.loadAccountByEmailRepository.loadByEmail(email)

    await this.hasher.hash(password)

    await this.addAccountRepository.add({
      name,
      email,
      password
    })

    return null
  }
}
