import {
  AccountReturnedByDbModel,
  Hasher,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountReturnedByDbModel> {
    const { name, email, password } = accountData

    const findAccountByEmail = await this.loadAccountByEmailRepository.loadByEmail(
      email
    )

    if (findAccountByEmail) {
      return null
    }

    await this.hasher.hash(password)

    const account = await this.addAccountRepository.add({
      name,
      email,
      password
    })

    if (account) {
      return account
    }

    return null
  }
}
