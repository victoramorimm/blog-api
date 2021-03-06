import {
  AccountReturnedByDbModel,
  LoadAccountByToken
} from '../../../presentation/middlewares/auth-middleware-protocols'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(token: string): Promise<AccountReturnedByDbModel> {
    const isTokenValid = await this.decrypter.decrypt(token)

    if (isTokenValid) {
      await this.loadAccountByTokenRepository.loadByToken(token)
    }

    return null
  }
}
