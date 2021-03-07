import {
  AccountReturnedByDbModel,
  LoadAccountByToken,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(token: string): Promise<AccountReturnedByDbModel> {
    const isTokenValid = await this.decrypter.decrypt(token)

    if (isTokenValid) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token)

      if (account) {
        return account
      }
    }

    return null
  }
}
