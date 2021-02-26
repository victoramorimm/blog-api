import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../add-account/db-add-account-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async authenticate(authenticationDate: AuthenticationModel): Promise<void> {
    const { email } = authenticationDate

    await this.loadAccountByEmailRepository.loadByEmail(email)
  }
}
