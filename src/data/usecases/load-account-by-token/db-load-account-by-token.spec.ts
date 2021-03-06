import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountReturnedByDbModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_value'))
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
    async loadByToken(token: string): Promise<AccountReturnedByDbModel> {
      const fakeAccount = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
      }

      return await new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()

  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()

  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const account = await sut.load('any_token')

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    )

    await sut.load('any_token')

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const account = await sut.load('any_token')

    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.load('any_token')

    expect(account).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })
})
