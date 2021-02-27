import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly secret: string
  ) {}

  async authenticate(authenticationDate: AuthenticationModel): Promise<string> {
    const { email, password } = authenticationDate

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (!account) {
      return null
    }

    await this.hashComparer.compare({
      value: password,
      valueToCompare: account.password
    })

    await this.encrypter.encrypt({
      value: account.id,
      secret: this.secret
    })

    return null
  }
}
