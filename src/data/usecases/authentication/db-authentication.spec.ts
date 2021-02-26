import { AccountReturnedByDbModel } from '../../models/account-returned-by-db-model'
import { LoadAccountByEmailRepository } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountReturnedByDbModel> {
        const fakeAccount = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password'
        }

        return await new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

    await sut.authenticate({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
