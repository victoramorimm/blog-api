import {
  AccountReturnedByDbModel,
  LoadAccountByToken
} from '../../../presentation/middlewares/auth-middleware-protocols'
import { Decrypter } from '../../protocols/criptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(value: string): Promise<AccountReturnedByDbModel> {
    await this.decrypter.decrypt(value)

    return null
  }
}
