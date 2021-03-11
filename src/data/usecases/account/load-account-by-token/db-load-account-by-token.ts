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

  async load(accessToken: string): Promise<AccountReturnedByDbModel> {
    const isTokenValid = await this.decrypter.decrypt(accessToken)

    if (isTokenValid) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken
      )

      if (account) {
        return account
      }
    }

    return null
  }
}
